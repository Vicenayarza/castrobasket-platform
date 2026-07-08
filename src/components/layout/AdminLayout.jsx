import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

export default function AdminLayout({ children }) {

  return (

    <div className="flex bg-slate-100">

      <AppSidebar />

      <div className="flex-1">

        <AppHeader />

        <main className="p-8">

          {children}

        </main>

      </div>

    </div>

  );

}