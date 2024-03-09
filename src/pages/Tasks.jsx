import Menu from "../components/Menu";
import LogoutButton from "../components/SignOut";
import TaskForm from "../components/Tasks";



const Tasks = () => {
  return (
    <>
      <div className="tlacitko">
        <LogoutButton />
      
      </div>
      <Menu />
      <TaskForm />
  
    </>
  );
};

export default Tasks;