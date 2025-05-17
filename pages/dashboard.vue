<template>
  <main class="min-h-screen bg-slate-100 p-4 md:p-8">
    <!-- Page Metadata -->
    <!-- Header Section -->
    <header class="text-center mb-8 md:mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-slate-800">Dashboard </h1>
      <p class="text-slate-500 mt-2 text-lg md:text-xl">PoC: LLM-Powered Profile & Roadmap</p>
    </header>

    <!-- Content Area - Grid Layout -->
    <div class="grid gap-6 lg:gap-8 lg:grid-cols-12">
      <!-- Pending Candidates Section -->
      <section class="lg:col-span-4">
        <Collapsible v-model:open="isPendingCandidatesOpen" class="w-full">
          <Card class="rounded-xl shadow-xl h-full">
            <CollapsibleTrigger asChild>
              <CardHeader class="flex flex-row items-center p-4 cursor-pointer">
                <CardTitle class="text-xl md:text-2xl font-semibold text-gray-700 flex-grow min-w-0 whitespace-nowrap">
                  Candidates ({{ pendingCandidates.length }})
                </CardTitle>
                <div class="flex flex-col items-center ml-3">
                  <ChevronUp v-if="isPendingCandidatesOpen" class="h-5 w-5" />
                  <ChevronDown v-else class="h-5 w-5" />
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div class="p-4 space-y-3 border-b border-slate-200">
                <div class="w-full">
                  <Button variant="outline" size="sm" @click="handleResumeUploadClick" class="w-full whitespace-nowrap">
                    <UploadCloud class="w-4 h-4 mr-2 shrink-0" />
                    Upload Resumes (Bulk Supported)
                  </Button>
                  <input 
                    type="file" 
                    ref="resumeInput" 
                    multiple 
                    @change="handleFilesSelected" 
                    class="hidden"
                    accept=".pdf,.doc,.docx,.txt" 
                  />
                </div>
                <div class="relative w-full">
                  <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    v-model="searchQuery"
                    placeholder="Search by name or role..."
                    class="h-9 w-full pl-9"
                    aria-label="Search candidates"
                  />
                </div>
              </div>
              <CardContent class="space-y-3 pt-4 px-4 pb-4">
                <div
                  v-for="candidate in filteredPendingCandidates"
                  :key="candidate.id"
                  class="p-4 rounded-lg border transition-all duration-200 ease-in-out cursor-pointer group"
                  :class="[
                    selectedCandidateId === candidate.id
                      ? 'bg-indigo-50 border-indigo-400 ring-2 ring-indigo-300 shadow-lg'
                      : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-md',
                  ]"
                  @click="selectedCandidateId = candidate.id"
                >
                  <h3 
                    class="font-semibold text-base group-hover:text-indigo-700"
                    :class="selectedCandidateId === candidate.id ? 'text-indigo-700' : 'text-slate-800'"
                  >
                    {{ candidate.name }}
                  </h3>
                  <p 
                    class="text-sm"
                    :class="selectedCandidateId === candidate.id ? 'text-slate-600' : 'text-slate-500'"
                  >
                    {{ candidate.role }}
                  </p>
                  <div class="flex justify-between items-center mt-3">
                    <Badge
                      :variant="getStatusVariant(candidate.status)"
                      class="px-2.5 py-0.5 text-xs font-medium"
                      :class="{
                        // Keep specific badge background/text colors if variant prop doesn't cover them fully
                        'bg-yellow-100 text-yellow-700 border-yellow-300': candidate.status === 'Pending Review' && getStatusVariant(candidate.status) === 'yellow',
                        'bg-blue-100 text-blue-700 border-blue-300': candidate.status === 'Awaiting Interview' && getStatusVariant(candidate.status) === 'blue',
                        'bg-green-100 text-green-700 border-green-300': candidate.status === 'New Applicant' && getStatusVariant(candidate.status) === 'green',
                      }"
                    >
                      {{ candidate.status }}
                    </Badge>
                    <span 
                      class="text-sm font-semibold"
                      :class="selectedCandidateId === candidate.id ? 'text-indigo-600' : 'text-indigo-500'"
                    >
                      {{ candidate.score }}% Match
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter class="pt-4 border-t border-slate-200">
                <p class="text-xs text-slate-500 italic">
                  Clicking a candidate would update profile and roadmap in a full app.
                </p>
              </CardFooter>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </section>

      <!-- Profile & Roadmap Column -->
      <div class="lg:col-span-8 space-y-6 lg:space-y-8">
        <!-- Merged Candidate Profile & Roadmap Section -->
        <section v-if="selectedCandidateProfile">
          <Card class="rounded-xl shadow-xl">
            <CardHeader>
              <CardTitle class="text-2xl font-semibold text-slate-700">Candidate Details & Roadmap</CardTitle>
            </CardHeader>
            <CardContent class="space-y-6">
              <!-- Profile Details Part -->
              <div class="profile-details space-y-4">
                <div class="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                  <img 
                    v-if="selectedCandidateProfile.imageUrl"
                    :src="selectedCandidateProfile.imageUrl" 
                    :alt="selectedCandidateProfile.name" 
                    class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-slate-200 shadow-md"
                  />
                  <div class="flex-grow">
                    <div class="flex flex-col sm:flex-row justify-between items-start mb-1">
                      <h3 class="text-3xl font-bold text-indigo-600">{{ selectedCandidateProfile.name }}</h3>
                      <span class="text-2xl font-bold text-indigo-500 bg-indigo-100 px-3 py-1 rounded-lg shadow-sm whitespace-nowrap mt-2 sm:mt-0">{{ selectedCandidateProfile.score }}% Match</span>
                    </div>
                    <p class="text-lg text-slate-600">{{ selectedCandidateProfile.currentRole }}</p>
                  </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm pt-4 border-t border-slate-200 mt-4">
                  <p><strong class="text-slate-700">Email:</strong> <a :href="`mailto:${selectedCandidateProfile.email}`" class="text-indigo-500 hover:underline">{{ selectedCandidateProfile.email }}</a></p>
                  <p><strong class="text-slate-700">Phone:</strong> <span class="text-slate-600">{{ selectedCandidateProfile.phone }}</span></p>
                  <p><strong class="text-slate-700">LinkedIn:</strong> <a :href="`https://${selectedCandidateProfile.linkedin}`" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:underline">{{ selectedCandidateProfile.linkedin }}</a></p>
                  <p><strong class="text-slate-700">Education:</strong> <span class="text-slate-600">{{ selectedCandidateProfile.education }}</span></p>
                </div>
                <div>
                  <h4 class="font-semibold text-slate-700 mb-1.5">Skills:</h4>
                  <div class="flex flex-wrap gap-2">
                    <Badge
                      v-for="skill in selectedCandidateProfile.skills"
                      :key="skill"
                      variant="outline"
                      class="px-2.5 py-0.5 text-sm bg-slate-200 text-slate-700 border-slate-300"
                    >
                      {{ skill }}
                    </Badge>
                  </div>
                </div>
                <div>
                  <h4 class="font-semibold text-slate-700 mb-1">Experience:</h4>
                  <p class="text-sm text-slate-600 leading-relaxed">{{ selectedCandidateProfile.experience }}</p>
                </div>
                <div>
                  <h4 class="font-semibold text-slate-700 mb-1">Aspirations:</h4>
                  <p class="text-sm text-slate-600 leading-relaxed">{{ selectedCandidateProfile.aspirations }}</p>
                </div>
              </div>

              <!-- Spider Chart Placeholder -->
              <div class="my-6">
                <h4 class="text-xl font-semibold text-slate-700 mb-4">Candidate Attributes Radar</h4>
                <ClientOnly>
                  <RadarChart 
                    v-if="selectedCandidateProfile && selectedCandidateProfile.attributes"
                    :attributes="selectedCandidateProfile.attributes" 
                    :candidateName="selectedCandidateProfile.name"
                  />
                  <div v-else class="p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50 min-h-[200px] flex items-center justify-center">
                    <p class="text-slate-500 italic">Attribute data is not available for this candidate.</p>
                  </div>
                  <template #fallback>
                    <div class="p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50 min-h-[200px] flex items-center justify-center">
                      <p class="text-slate-500 italic">Loading chart...</p>
                    </div>
                  </template>
                </ClientOnly>
              </div>

              <!-- Divider -->
              <hr class="my-6 border-slate-300">

              <!-- Recommended Development Roadmap Part -->
              <div class="roadmap-details">
                <h4 class="text-xl font-semibold text-slate-700 mb-6">Recommended Development Roadmap</h4>
                <div class="space-y-8">
                  <div v-for="(item, index) in parsedRoadmap" :key="index" class="roadmap-step flex items-start">
                    <div class="flex flex-col items-center mr-4">
                      <div class="bg-indigo-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold ring-4 ring-indigo-200">
                        {{ index + 1 }}
                      </div>
                      <div v-if="index < parsedRoadmap.length - 1" class="flex-grow w-px bg-slate-300 my-2 min-h-[40px]"></div>
                    </div>
                    <div class="pt-1 pb-2 flex-1">
                      <h5
                        class="text-lg font-semibold text-slate-800 mb-1.5 flex items-center"
                        
                      >
                        <Milestone class="w-5 h-5 mr-2 text-indigo-500 shrink-0" />
                        <span v-html="item.mainPoint"></span>
                      </h5>
                      <ul v-if="item.subPoints && item.subPoints.length > 0" class="space-y-2 pl-1 mt-2 text-slate-600">
                        <li v-for="(subPoint, subIndex) in item.subPoints" :key="subIndex" class="text-sm leading-relaxed flex items-start">
                          <ChevronRight class="w-4 h-4 mr-2 mt-0.5 text-indigo-400 shrink-0" />
                          <span>{{ subPoint }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>

    <!-- Footer Section -->
    <footer class="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-slate-300 text-center">
      <p class="text-sm text-slate-600">AI Job Profile Matching PoC © {{ new Date().getFullYear() }}</p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ListChecks, Target, Lightbulb, BookOpen, Milestone, ChevronRight, ChevronDown, ChevronUp, Search, UploadCloud } from 'lucide-vue-next';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import RadarChart from '@/components/charts/RadarChart.vue';

// Page Metadata
useHead({
  title: 'RightSeat',
  meta: [
    { name: 'description', content: 'A proof-of-concept for LLM-powered job profile matching and candidate development roadmapping.' }
  ],
});

// --- Mock Data --- //

interface Candidate {
  id: number;
  name: string;
  role: string;
  status: 'Pending Review' | 'Awaiting Interview' | 'New Applicant';
  score: number; // Added for scoring percentage
  // profile?: CandidateProfile; // We'll keep detailed profile data separate for now
  // roadmapText?: string;
}

interface CandidateProfile {
  name: string;
  currentRole: string;
  email: string;
  phone: string;
  linkedin: string;
  education: string;
  skills: string[];
  experience: string;
  aspirations: string;
  imageUrl: string; // Added for candidate image
  score: number; // Added for scoring percentage
  attributes: {
    education: number;
    experience: number;
    character: number;
    cultureFit: number;
  };
}

const allCandidateProfiles: Record<number, CandidateProfile> = {
  1: {
    name: 'Alex Chen',
    currentRole: 'Junior Web Developer',
    email: 'alex.chen@example.com',
    phone: '555-0101',
    linkedin: 'linkedin.com/in/alexchenexample',
    education: 'B.Sc. in Computer Science - XYZ University',
    skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Vue.js (basic)', 'Git'],
    experience: '1 year working on small company website projects, focusing on frontend development with HTML, CSS, and JavaScript. Contributed to UI implementation and bug fixing. Eager to learn and grow in a dynamic team environment.',
    aspirations: 'Wants to become a proficient Full-Stack Developer, with a strong focus on modern JavaScript frameworks and cloud technologies. Interested in building scalable and user-friendly web applications.',
    imageUrl: 'https://picsum.photos/seed/alex/100/100',
    score: 85,
    attributes: { education: 80, experience: 70, character: 85, cultureFit: 90 },
  },
  2: {
    name: 'Brenda Lee',
    currentRole: 'UX Designer Intern',
    email: 'brenda.lee@example.com',
    phone: '555-0102',
    linkedin: 'linkedin.com/in/brendaleeexample',
    education: 'Diploma in Interactive Design - ABC Institute',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    experience: '6 months internship at a startup, assisting senior designers with wireframes and user testing. Passionate about creating intuitive user experiences.',
    aspirations: 'Aspires to be a Senior UX Designer leading impactful projects.',
    imageUrl: 'https://picsum.photos/seed/brenda/100/100',
    score: 78,
    attributes: { education: 75, experience: 65, character: 90, cultureFit: 80 },
  },
  3: {
    name: 'Charles Davis',
    currentRole: 'Data Analyst Aspirant',
    email: 'charles.davis@example.com',
    phone: '555-0103',
    linkedin: 'linkedin.com/in/charlesdavisexample',
    education: 'M.Sc. in Data Science - LMN University',
    skills: ['Python', 'SQL', 'Tableau', 'Statistics', 'Machine Learning (basic)'],
    experience: 'Completed several academic projects involving data analysis and visualization. Strong analytical skills and attention to detail.',
    aspirations: 'Seeking an entry-level Data Analyst position to apply and expand my skills.',
    imageUrl: 'https://picsum.photos/seed/charles/100/100',
    score: 92,
    attributes: { education: 90, experience: 75, character: 80, cultureFit: 85 },
  },
   4: {
    name: 'Diana Evans',
    currentRole: 'Frontend Intern',
    email: 'diana.evans@example.com',
    phone: '555-0104',
    linkedin: 'linkedin.com/in/dianaevansexample',
    education: 'Coding Bootcamp Certificate - Dev Academy',
    skills: ['HTML', 'CSS', 'JavaScript', 'React (learning)'],
    experience: 'Recently completed an intensive coding bootcamp. Built several small projects. Quick learner and highly motivated.',
    aspirations: 'To secure a Junior Frontend Developer role and master React.',
    imageUrl: 'https://picsum.photos/seed/diana/100/100',
    score: 70,
    attributes: { education: 70, experience: 60, character: 75, cultureFit: 70 },
  },
};

const allRoadmapTexts: Record<number, string> = {
  1: `
1.  **Deepen Vue.js & JavaScript Expertise:**
    * Focus: Advanced JavaScript concepts (closures, async/await, prototypes) and Vue.js state management (Pinia), Composition API in-depth, and performance optimization.
    * Action: Complete an advanced online course. Build 2-3 complex personal projects using Nuxt.js.

2.  **Master Backend Development (e.g., with Nitro or a dedicated backend):**
    * Focus: Building robust RESTful APIs/server routes within Nuxt/Nitro, or integrating with a separate backend (e.g., Node.js/Express, Python/FastAPI). Understand middleware, database integration, authentication.
    * Action: Develop the backend logic or API integrations for your Nuxt.js projects.

3.  **Database Proficiency (SQL & NoSQL):**
    * Focus: Data modeling, querying for PostgreSQL and MongoDB.
    * Action: Integrate databases into full-stack projects.
  `,
  2: `
1.  **Advance Prototyping & Interaction Design Skills:**
    * Focus: Complex prototyping in Figma (variables, conditional logic), microinteractions, animation principles.
    * Action: Recreate 2-3 advanced UI interactions from popular apps. Take a specialized course on UI animation.

2.  **Strengthen User Research & Testing Methodologies:**
    * Focus: Conducting usability tests, A/B testing, survey design, qualitative data analysis.
    * Action: Volunteer for or initiate user research for 2 small projects. Read case studies on effective user research.

3.  **Explore UX Writing & Content Strategy:**
    * Focus: Crafting clear, concise, and user-centered copy for interfaces. Understanding information architecture.
    * Action: Review and rewrite UI copy for existing projects. Study UX writing guidelines.
  `,
  // Add more roadmaps as needed
};

const pendingCandidates = ref<Candidate[]>([
  { id: 1, name: 'Alex Chen', role: 'Junior Web Developer', status: 'Pending Review', score: 85 },
  { id: 2, name: 'Brenda Lee', role: 'UX Designer Intern', status: 'Awaiting Interview', score: 78 },
  { id: 3, name: 'Charles Davis', role: 'Data Analyst Aspirant', status: 'New Applicant', score: 92 },
  { id: 4, name: 'Diana Evans', role: 'Frontend Intern', status: 'Pending Review', score: 70 },
]);

const selectedCandidateId = ref<number | null>(1); // Alex Chen is selected by default

const selectedCandidateProfile = computed(() => {
  if (selectedCandidateId.value === null) return null;
  return allCandidateProfiles[selectedCandidateId.value];
});

const currentRoadmapText = computed(() => {
  if (selectedCandidateId.value === null || !allRoadmapTexts[selectedCandidateId.value]) {
    return "No roadmap available for this candidate.";
  }
  return allRoadmapTexts[selectedCandidateId.value];
});

// Helper function to parse the roadmap string
const parsedRoadmap = computed(() => {
  if (!currentRoadmapText.value || currentRoadmapText.value === "No roadmap available for this candidate.") return [];

  // Remove leading/trailing whitespace from the whole text and then split by double newlines for sections
  const sections = currentRoadmapText.value.trim().split(/\n\s*\n/);

  return sections.map(section => {
    const lines = section.trim().split('\n').map(line => line.trim());
    let mainPoint = lines[0] || '';
    const subPoints: string[] = [];

    // Process main point: remove numbering, make bold text actually bold
    mainPoint = mainPoint.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Process sub-points
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('*') || line.startsWith('-')) {
        subPoints.push(line.substring(line.indexOf(' ') + 1).trim());
      } else if (line) { // If it's not a bullet but part of the previous sub-point (multi-line sub-point)
        if (subPoints.length > 0) {
          subPoints[subPoints.length - 1] += ' ' + line;
        } else {
           // Or if it's a continuation of main point that wasn't a sub-point
           mainPoint += ' ' + line;
        }
      }
    }
    return { mainPoint, subPoints };
  }).filter(section => section.mainPoint); // Ensure sections with no main point are filtered out
});


const getStatusVariant = (status: Candidate['status']): VariantProps<typeof Badge.__defaults>['variant'] => {
  switch (status) {
    case 'Pending Review':
      return 'yellow';
    case 'Awaiting Interview':
      return 'blue';
    case 'New Applicant':
      return 'green';
    default:
      return 'secondary';
  }
};

const isPendingCandidatesOpen = ref(true); // Default to open

const searchQuery = ref('');
const resumeInput = ref<HTMLInputElement | null>(null);

const filteredPendingCandidates = computed(() => {
  if (!searchQuery.value) {
    return pendingCandidates.value;
  }
  return pendingCandidates.value.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    candidate.role.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleResumeUploadClick = () => {
  resumeInput.value?.click();
};

const handleFilesSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    if (files.length > 0) {
      console.log('Selected files:', files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })));
      // Here you would typically handle the file upload process
      // For example, using FormData and sending to a server
      alert(`${files.length} file(s) selected. Check console for details.`);
    } else {
      console.log('No files selected.');
    }
    // Reset the input value to allow selecting the same file again if needed
    target.value = '';
  }
};

</script>

<style scoped>
/* Add any page-specific styles here if necessary */
/* For example, to ensure prose classes apply well with shadcn components */
:deep(.prose ul) {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
:deep(.prose li) {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}
</style> 