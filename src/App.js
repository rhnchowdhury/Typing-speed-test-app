import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { toggleDarkMode } from './Components/DarkMode/DarkModeSlice';
import Typing from './Components/Typing';
import { MdLightMode } from "react-icons/md";

function App() {
  const { mode } = useSelector((state) => state.darkMode);
  const dispatch = useDispatch();
  return (
    <div className='py-12 lg:py-32' style={{ background: mode ? 'black' : '#f5f0f0' }}>
      <Typing>
      </Typing>
      <div className='card-actions justify-center mr-60 mt-5'>
        <button onClick={() => dispatch(toggleDarkMode())} className=' p-5 rounded-md' style={{ boxShadow: '2px 2px 3px' }}><MdLightMode></MdLightMode></button>
      </div>
    </div>
  );
}

export default App;
