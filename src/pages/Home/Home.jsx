import { useEffect, useState } from "react";
import "./Home.scss";
import { deleteForm, getAllForms } from "../../services/form.services";
import { useNavigate } from "react-router-dom";

function Home({ setEditMode }) {
  const [forms, setForms] = useState([]);
  const [reFetch, setReFetch] = useState(null);

  useEffect(() => {
    setEditMode(false);
  }, []);

  useEffect(() => {
    const fetchAllForms = async () => {
      try {
        const res = await getAllForms();

        if (res.status === 200) {
          const data = await res.json();
          setForms(data.forms);
        } else {
          console.error("Error");
        }
      } catch (error) {
        alert(error.message);
      }
    };

    fetchAllForms();
  }, [reFetch]);

  const deleteFormAPI = async (formId) => {
    try {
      const res = await deleteForm(formId);

      if( res.status === 200) {
        const data = await res.json();
        alert(data.message);
        setReFetch(Date.now());
      }
    } catch (err) {
      alert(err.message);
    }
  }

  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="header">
        <div className="headings-container">
          <div className="heading">
            <h1>Welcome to Form.com</h1>
          </div>
          <div className="subHeading">
            <p>This is a simple form builder.</p>
          </div>
        </div>
        <button onClick={() => navigate('/create')}>Create New Form</button>
      </div>

      <span className="line-separator"></span>

      <div className="forms-list">
        <div className="forms-heading">
          <h1>Forms</h1>
        </div>
        <div className="all-forms-container">
          {forms.length > 0 ? ( 
             forms.map( (form) => (
                <div key={form._id} className="form-container">
                    <div className="form-title">
                        <p>{form.title}</p>
                    </div>
                    <div className="form-actionButtons">
                        <button className="view" onClick={() => navigate(`/view/${form._id}`)}>View</button>
                        <button className="edit" onClick={() => {
                          setEditMode(true);
                          navigate(`/edit/${form._id}`);
                        }}>Edit</button>
                        <button className="delete" onClick={() => deleteFormAPI(form._id)}>Delete</button>
                    </div>
                </div>
            ))
           ) : (
            <div className="no-forms">
              <p>You have no forms created yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
