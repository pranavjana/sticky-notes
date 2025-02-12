import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

const products = [
  {
    title: "Quick Notes",
    description: "Capture quick thoughts and ideas instantly",
    features: ["Fast capture", "Auto-save", "Easy access"],
    icon: "✏️",
    link: "#",
  },
  {
    title: "Task Lists",
    description: "Stay organized with smart to-do lists",
    features: ["Checkboxes", "Due dates", "Priority levels"],
    icon: "✓",
    link: "#",
  },
  {
    title: "Project Ideas",
    description: "Brainstorm and develop your next big project",
    features: ["Mind mapping", "Attachments", "Categories"],
    icon: "💡",
    link: "#",
  },
  {
    title: "Daily Journal",
    description: "Document your daily thoughts and reflections",
    features: ["Templates", "Mood tracking", "Daily prompts"],
    icon: "📔",
    link: "#",
  },
  {
    title: "Meeting Notes",
    description: "Never miss important meeting details",
    features: ["Action items", "Attendees", "Follow-ups"],
    icon: "👥",
    link: "#",
  },
  {
    title: "Reminders",
    description: "Set reminders for important tasks",
    features: ["Notifications", "Recurring alerts", "Priority"],
    icon: "⏰",
    link: "#",
  },
  {
    title: "Goals",
    description: "Track your personal and professional goals",
    features: ["Progress tracking", "Milestones", "Deadlines"],
    icon: "🎯",
    link: "#",
  },
  {
    title: "Brainstorming",
    description: "Let your creativity flow freely",
    features: ["Mind maps", "Collaboration", "Sketching"],
    icon: "🧠",
    link: "#",
  },
  {
    title: "Reading List",
    description: "Keep track of your reading materials",
    features: ["Bookmarks", "Categories", "Progress"],
    icon: "📚",
    link: "#",
  },
  {
    title: "Travel Plans",
    description: "Plan your trips and adventures",
    features: ["Itineraries", "Checklists", "Maps"],
    icon: "✈️",
    link: "#",
  },
  {
    title: "Recipes",
    description: "Save and organize your favorite recipes",
    features: ["Ingredients", "Instructions", "Categories"],
    icon: "🍳",
    link: "#",
  },
  {
    title: "Bucket List",
    description: "Track your life goals and dreams",
    features: ["Categories", "Progress", "Timeline"],
    icon: "🌟",
    link: "#",
  },
];

const SignUpSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const titleComponent = (
    <div className="mb-8">
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
        Start Taking Notes
      </h2>
      <p className="text-neutral-300 text-xl max-w-2xl mx-auto">
        Join thousands of users who organize their thoughts with our digital sticky notes.
      </p>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
    >
      <div
        className="py-10 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <motion.div
          style={{
            translateY: translate,
          }}
          className="max-w-5xl mx-auto text-center"
        >
          {titleComponent}
        </motion.div>

        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
          }}
          className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-6 bg-[#222222] rounded-[30px] shadow-2xl"
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-neutral-950 p-8 flex flex-col items-center justify-center">
            <div className="text-center space-y-8">
              <h3 className="text-3xl font-bold text-white mb-4">
                Get Started for Free
              </h3>
              <p className="text-neutral-300 text-lg max-w-2xl">
                No credit card required. Start organizing your thoughts in seconds.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <SignUpButton mode="modal">
                  <button className="px-8 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium transition-colors">
                    Sign Up Now
                  </button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <button className="px-8 py-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-lg font-medium transition-colors">
                    Already have an account?
                  </button>
                </SignInButton>
              </div>
              <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-purple-400 mb-2">100%</h4>
                  <p className="text-neutral-400">Free to Start</p>
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-purple-400 mb-2">Unlimited</h4>
                  <p className="text-neutral-400">Notes & Lists</p>
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-bold text-purple-400 mb-2">Real-time</h4>
                  <p className="text-neutral-400">Sync Across Devices</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const DotBackground = () => {
  return (
    <div className="absolute inset-0 h-full w-full -z-10">
      <div className="absolute h-full w-full bg-neutral-900">
        <div className="absolute h-full w-full bg-[radial-gradient(#8b5cf6_0.5px,transparent_0.5px)] [background-size:16px_16px] opacity-[0.15]" />
        <div className="absolute h-full w-full bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:48px_48px] opacity-[0.1]" />
        <div className="absolute top-0 h-full w-full bg-[linear-gradient(to_bottom,transparent_0%,#171717_100%)] opacity-40" />
      </div>
    </div>
  );
};

export const LandingPage = () => {
  const firstRow = products.slice(0, 4);
  const secondRow = products.slice(4, 8);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  // New scroll opacity for fixed header
  const headerOpacity = useTransform(
    scrollYProgress,
    [0, 0.2],
    [0, 1]
  );

  return (
    <div className="bg-neutral-900 min-h-screen relative">
      <DotBackground />
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.h2 
            style={{ opacity: headerOpacity }}
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text"
          >
            Everything Noted.
          </motion.h2>
          <div className="flex items-center gap-4">
            <SignInButton mode="modal">
              <button className="px-8 py-2 rounded-md bg-purple-600 text-white font-bold transition duration-200 hover:bg-white hover:text-purple-600 border-2 border-transparent hover:border-purple-600">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </nav>
      
      <div
        ref={ref}
        className="h-[200vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
      >
        <Header />
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
          }}
        >
          <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
            {firstRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateX}
                key={product.title}
              />
            ))}
          </motion.div>
          <motion.div className="flex flex-row mb-20 space-x-20">
            {secondRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateXReverse}
                key={product.title}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      <SignUpSection />
    </div>
  );
};

const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold text-white">
        Your Digital <br /> Sticky Notes
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-neutral-200">
        Capture your thoughts, organize your life, and never forget a brilliant idea. 
        Our digital sticky notes bring the familiar feel of paper notes to your digital workspace.
      </p>
    </div>
  );
};

const ProductCard = ({ product, translate }) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
        scale: 1.02,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <div className="block group-hover/product:shadow-2xl">
        <div
          className="absolute inset-0 h-full w-full rounded-xl p-6 flex flex-col"
          style={{
            background: `linear-gradient(135deg, ${getRandomColor()} 0%, ${getRandomColor()}cc 100%)`,
          }}
        >
          {/* Content Container */}
          <div className="relative z-10 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{product.icon}</span>
              <h2 className="text-2xl font-bold text-neutral-800">
                {product.title}
              </h2>
            </div>

            {/* Description */}
            <p className="text-neutral-700 mb-4 font-medium">
              {product.description}
            </p>

            {/* Features */}
            <div className="mt-auto">
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">
                Features:
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 rounded-full bg-black/10 text-sm text-neutral-700"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-100 bg-black/70 transition-opacity rounded-xl p-6 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                {product.title}
              </h2>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors backdrop-blur-sm">
                Try it now
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const getRandomColor = () => {
  const colors = [
    '#fef3c7', // yellow
    '#fee2e2', // pink
    '#dcfce7', // green
    '#dbeafe', // blue
    '#f5d0fe', // purple
    '#ffedd5', // orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default LandingPage; 
