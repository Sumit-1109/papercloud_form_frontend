import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFormById, sendResponse } from "../../services/form.services";
import InputField from "../../components/InputField/InputField";
import "./FormPage.scss";

function FormPage() {
  const { formId } = useParams();
  const [inputs, setInputs] = useState(null);
  const [title, setTitle] = useState("");
  const [group, setGroup] = useState("None");
  const [expandSections, setExpandSections] = useState({});
  const [inputValidation, setInputValidation] = useState([]);

  useEffect(() => {
    const fetchForm = async () => {
      if (!formId) return;

      try {
        const res = await getFormById(formId);

        if (res.status === 200) {
          const data = await res.json();
          console.log(data.form.title);
          setInputs(data.form.inputFields);
          setTitle(data.form.title);
          setGroup(data.form.groupBy);

          const initialValidation = data.form.inputFields.map((input) => ({
            id: input._id,
            title: input.title,
            type: input.type,
            value: "",
          }));
        setInputValidation(initialValidation);

          const defaultExpand = {};
          if (data.form.groupBy === "Category") {
            data.form.inputFields.forEach((input) => {
              const category = input.category || "Uncategorised";
              defaultExpand[category] = true;
            });
          } else if (data.form.groupBy === "Input Type") {
            data.form.inputFields.forEach((input) => {
              defaultExpand[input.type] = true;
            });
          }
          setExpandSections(defaultExpand);
        }
      } catch (err) {
        alert(err.message);
      }
    };

    fetchForm();
  }, []);

  const handleInputChange = (id, newValue) => {
    setInputValidation((prevInputs) =>
      prevInputs.map((input) =>
        input.id === id ? { ...input, value: newValue } : input
      )
    );
  };

  const groupedInputs = () => {
    if (!inputs) return {};

    if (group === "None") {
      return { Normal: inputs };
    } else if (group === "Category") {
      return inputs.reduce((acc, input) => {
        const category = input.category || "Uncategorised";
        if (!acc[category]) acc[category] = [];
        acc[category].push(input);
        return acc;
      }, {});
    } else if (group === "Input Type") {
      return inputs.reduce((acc, input) => {
        if (!acc[input.type]) acc[input.type] = [];
        acc[input.type].push(input);
        return acc;
      }, {});
    }
  };

  const toggleSection = (groupName) => {
    setExpandSections((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{

    const res = await sendResponse(inputValidation);

    if(res.status === 200) {
      const data = await res.json();
      alert(data.message);
    } else {
      const data = await res.json();
      alert(data.error);
    };

    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="form-view-page">
      <form onSubmit={handleSubmit} className="form-view-form">
        <div className="form-Box">
          <div className="heading">
            <h1>{title}</h1>
          </div>

          <div className="form-inputs">
            {Object.entries(groupedInputs()).map(([groupName, fields]) => (
              <div key={groupName} className="input-group">
                {group !== "None" && (
                  <div
                    className="group-header"
                    onClick={() => toggleSection(groupName)}
                  >
                    <h3>{groupName}</h3>
                    <span>
                      {expandSections[groupName] ? (
                        <img src="/collapse.png" alt="expand" />
                      ) : (
                        <img src="/expand.png" alt="collapse" />
                      )}
                    </span>
                  </div>
                )}

                {(group === "None" || expandSections[groupName]) && (
                  <div className="group-content">
                    {fields.map((input) => {
                      const responseData = inputValidation.find((item) => item.id === input._id);

                      return (
                      <div key={input.id} className="input-wrapper">
                        <InputField
                          label={input.title}
                          formPlaceholder={input.placeholder}
                          value={responseData ? responseData.value : ""}
                          onChange={(e) => handleInputChange(responseData.id, e.target.value)}
                        />
                      </div>
                    )
                      
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button type="submit">Submit</button>

        </div>
        
      </form>
    </div>
  );
}

export default FormPage;
