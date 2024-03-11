"use server";

import getCurrentUser from "./getCurrentUser";
import prisma from "./db/prisma";

const skillKeywords = [
  "Relational Database",
  "Nonrelational Database",
  "Sequelize",
  "Data Structures",
  "Algorithms",
  "MariaDB",
  "SQLite",
  "Django",
  "Spring Boot",
  "Spring",
  "SEO",
  "Ruby",
  "Mongoose",
  "Google Tag Manager",
  "Google Analytics",
  "Shopify",
  "Stripe",
  "PHP",
  "jQuery",
  "MySQL",
  "Git",
  "Github",
  "Version Control",
  "CI / CD",
  "ElasticSearch",
  "Azure",
  "HTML",
  "HTML5",
  "CSS",
  "CSS3",
  "TailwindCSS",
  "Tailwind",
  "Nest",
  "Nest.js",
  "LESS",
  "SASS",
  "TypeScript",
  "JavaScript",
  "React",
  "Angular",
  "Redux",
  "React Native",
  "Next",
  "Nextjs",
  "Next.js",
  "React.js",
  "PostgreSQL",
  "Microsoft SQL Server",
  "MongoDB",
  "Prisma",
  "NoSQL",
  "SQL",
  "Webpack",
  "Java",
  "Objective-C",
  "Go (Golang)",
  "Golang",
  "GraphQL",
  "Apollo",
  "Python",
  "Flask",
  "C ++",
  "C#",
  "Node",
  "Express",
  "Websockets",
  "Web sockets",
  "GraphQL Subscriptions",
  ".NET",
  "Vue",
  "AWS",
  "Firebase",
  "Firebase Realtime Database",
  "Firebase Cloud Firestore",
  "Three.js",
  "Figma",
  "Expo",
  "Docker",
  "Kubernetes",
  "Kubeflow",
  "Cloudflare",
  "Ruby on Rails",
  "Storybook",
  "Jest",
  "Cypress",
  "Mocha",
  "Puppeteer",
  "Chai",
  "Jasmine",
  "Karma",
  "Enzyme",
  "Selenium",
  "Rust",
  "Microsoft Azure",
  "Hasura",
  "Kotlin",
  "Redis",
  "Kafka",
  "Sentry",
  "Datadog",
  "Pagerduty",
  "OpenTelemetry",
  "Terraform",
  "Restful APIs",
  "RestAPI",
  "Rest API",
  "OAuth",
  "GCP",
  "Google Cloud",
  "Google Cloud Platform",
  "Stable Diffusion",
  "LLM",
  "Swift",
  "Cassandra",
  "ScyllaDB",
  "ErlangVM",
  "WebGL",
  "Mapbox",
  "Odoo",
  "Scala",
  "Ruby",
  "Laravel",
  "Wordpress",
  "SvelteJS",
  "Postgres",
  "DynamoDB",
  "Kinesis",
  "Twilio",
  "Sendgrid",
  "CMS",
  "Content Management System",
  "Headless CMS",
  "Contentful",
  "Prismic",
  "Solana",
  "Metaplex",
  "tRPC",
  "Pulumi",
  "Data Visualization",
  "D3",
  "Plotly",
  "Android",
  "Pytorch",
  "WebRTC",
  "MobX",
  "Jotai",
  "Zustand",
  "XState",
  "Hasura",
  "Preact",
  "Solidjs",
  "Langchain",
  "LlamdaIndex",
  "FastAPI",
  "Machine Learning",
  "ThreeJS",
  "Blender",
  "Ember",
  "Lambda",
  "Vercel",
  "Netlify",
  "Heroku",
  "Digital Ocean",
  "Rales",
  "NLP",
  "Natural Language Processing",
  "Lucene",
  "Xcode",
  "React Query",
  "Tanstack",
  "useSWR",
  "Chrome Extensions",
  "Artifical Intelligence",
  "Wordpress Plugin",
  "LLMs",
  "GraphQL Subscriptions",
  "GraphQL Mutations",
  "GraphQL Queries",
  "Elixir",
  "Phoenix",
  "Apache",
  "Jenkins",
  "TDD",
  "React Spring",
  "Framer Motion",
  "React Testing Library",
  "Circle.ci",
  "CircleCI",
  "Github Actions",
  "GitLab CI",
  "GitlabCI",
  "CloudFormation",
  "Neo4j",
  "Flowscript",
  "Apache Airflow",
  "Material-UI",
  "MUI",
  "Probe",
  "Umami",
  "FFmpeg",
  ".NET",
  "Amazon Web Services",
  "Unity3D",
  "TensorFlow",
  "Theano",
  "OOP",
  "Firestore",
  "Blockchain",
  "Smart Contracts",
  "Amazon S3",
  "Celery",
  "AWS SageMaker",
  "A/B Testing",
  "PySpark",
  "OLAP SQL",
  "K8s",
  "WooCommerce",
  "BigCommerce",
  "Progressive Web App",
  "Ethereum",
  "Solidity",
  "Power Platform",
  "Microsoft 365",
  "Dynamics 365",
  "API Documentation",
  "RabbitMQ",
  "Symphony",
  "VertX",
  "JWT Tokens",
  "Test Driven Development",
  "Fargate",
  "Stripe API",
  "Jira",
  "Trello",
  "Fastify",
  "S3",
  "Svelte",
  "CloudWatch",
  "Kinesis",
  "Elastic Search",
  "Erlang",
  "Ionic",
  "Bigtable",
  "Supabase",
  "ASP.NET",
  "Flux",
  "Babel",
  "Chart.js",
  "Highcharts",
  "Highcharts.js",
  "BitBucket",
  "VanillaJS",
  "Vanilla JS",
  "Vanilla JavaScript",
  "Electron",
  "HTMX",
  "Middleware",
  "Vitest",
  "Automated testing",
  "Flutter",
  "NLTK",
  "NumPY",
  "SciPY",
  "Keras",
  "Unreal Engine",
  "PowerBI",
  "Linux",
  "RTKQuery",
  "AWS Amplify",
  "Elastic Beanstalk",
  "Amazon Redshift",
  "Amazon SNS",
  "Amazon SQS",
  "Amazon AWS Glue",
  "Data Lake",
  "AWS EventBridge",
  "Unit Testing",
  "Unit Tests",
  "Integration Testing",
  "Integration Tests",
  "Microservices",
  "JUnit",
  "TestNG",
  "Relay",
  "Haskell",
  "Clojure",
  "Perl",
];

const extractSkillsFromDescription = (description: string): string[] => {
  const extractedSkills: string[] = [];
  const lowercaseDescription = description.toLowerCase();
  // Iterate over skill keywords
  skillKeywords.forEach((skill) => {
    const lowercaseSkill = skill.toLowerCase();
    if (lowercaseDescription.includes(lowercaseSkill)) {
      extractedSkills.push(skill);
    }
  });
  return extractedSkills.length > 0 ? extractedSkills : ["No skills available"];
};

const updateSkillFrequencyMap = (
  skillFrequencyMap: Map<string, number>,
  jobSkills: string[]
) => {
  // Iterate through each skill in the jobSkills array
  for (const skill of jobSkills) {
    /* If the skill already exists in the skillFrequencyMap, 
    increment the value of skill in frequencyMap, 
    else set the value of skill in skillFrequency map to 1 */
    skillFrequencyMap.set(skill, (skillFrequencyMap.get(skill) || 0) + 1);
  }
};

export const getUserJobSkillsAndFrequency = async () => {
  try {
    // Retrieve the current user
    const currentUser = await getCurrentUser();

    // Check if the user ID is missing
    if (!currentUser?.id) {
      throw new Error("User not authenticated or user ID not found");
    }

    // Fetch user jobs from the database
    const userJobs = await prisma.job.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    // Initialize a Map to store the frequency of skills
    const skillFrequencyMap = new Map<string, number>();

    // Initialize an array to store job skills
    const jobSkills: string[] = [];

    // Iterate over user jobs
    for (const job of userJobs) {
      // Get the list of job skills extracted from the job description
      const extractedSkills = extractSkillsFromDescription(job.description);
      // Push the extracted skills into the jobSkills array
      jobSkills.push(...extractedSkills);
    }

    // Update skill frequency map
    updateSkillFrequencyMap(skillFrequencyMap, jobSkills);

    // Convert the skillFrequencyMap to an array of objects for sorting
    const skillFrequencyArray = Array.from(skillFrequencyMap.entries()).map(
      ([skill, frequency]) => ({ skill, frequency })
    );

    // Sort the skillFrequencyArray by frequency in descending order
    skillFrequencyArray.sort((a, b) => b.frequency - a.frequency);

    // Extract sorted skills and frequencies
    const sortedSkills = skillFrequencyArray.map((entry) => entry.skill);
    const sortedFrequencies = skillFrequencyArray.map(
      (entry) => entry.frequency
    );

    return { sortedSkills, sortedFrequencies };
  } catch (error) {
    console.error(
      "Error fetching user jobs or calculating skill frequency:",
      error
    );
    throw new Error("Failed to fetch user jobs or calculate skill frequency");
  }
};