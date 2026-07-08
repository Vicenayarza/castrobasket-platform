import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

function AdminLayout({ children }) {
  return (
    <div
      style={{
        display: "flex"
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1
        }}
      >
        <Header />

        <main
          style={{
            padding: "30px"
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;