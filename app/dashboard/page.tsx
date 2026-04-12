import DashboardCardsSection from "@/components/cards/DashboardCardsSection";

const DashboardPage = () => {
  return <div>
    <div className=" p-3">
        <h1 className="text-[22px] font-semibold text-[#101828]">DashboardOverview</h1>
        <p className="mt-1 text-[#667085] text-md">Welcome back! Here's whats happening with your tasks.</p>
        <DashboardCardsSection />
    </div>
  </div>;
};

export default DashboardPage;
