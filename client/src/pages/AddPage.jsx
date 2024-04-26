import { useEffect } from 'react';
import Header from '../components/header/header';
import Add from '../components/add/add'
import { useNavigate } from 'react-router-dom';

function AddAchiv() {

  const navigate = useNavigate()

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
    }
  }, []);

  return (
    <main class="container">
      <Header />
      <Add />
    </main>
  );
}

export default AddAchiv;
