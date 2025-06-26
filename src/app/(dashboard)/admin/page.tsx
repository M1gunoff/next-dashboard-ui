import Announcements from "@/components/Announcements"
import AttendanceChartContainer from "@/components/AttandanceChartContainer"
import CountChartContainer from "@/components/CountChartContainer"
import EventCalendarContainer from "@/components/EventCalendarContainer"
import FinanceChart from "@/components/FinanceChart"
import UserCard from "@/components/UserCard"

const AdminPage = ({
  searchParams,
} : {
  searchParams: { [keys: string]: string | undefined }
}) => {
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">

      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="admin" />
          <UserCard type="teacher" />
          <UserCard type="student" />
          <UserCard type="project" />
        </div>
        {/* MIDDLE CHARTS */} 
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-2/5 h-[350px]">
            <CountChartContainer />
          </div>
          <div className="w-full lg:w-3/5 h-[370px]">
            <AttendanceChartContainer />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer searchParams={searchParams} />
        <Announcements />
      </div>
    </div>
  )
}

export default AdminPage