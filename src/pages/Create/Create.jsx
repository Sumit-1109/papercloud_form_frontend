import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./Create.scss";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import InputField from "../../components/InputField/InputField";
import {
  createForm,
  editForm,
  getFormById,
} from "../../services/form.services";
import { useNavigate, useParams } from "react-router-dom";

function Create({ editMode }) {
  const [formTitle, setFormTitle] = useState("");
  const [editName, setEditName] = useState(false);
  const [addInput, setAddInput] = useState(false);
  const [editInputFieldTitle, setEditInputFieldTitle] = useState(false);
  const [selectedInputField, setSelectedInputField] = useState(null);
  const [inputs, setInputs] = useState([]);
  const [group, setGroup] = useState("None");
  const [expandSections, setExpandSections] = useState({});
  const [hover, setHover] = useState(false);
 
  const navigate = useNavigate();

  const inputTypes = ["TEXT", "NUMBER", "EMAIL", "PASSWORD", "DATE"];

  const { formId } = useParams();

  const addInputField = (type) => {
    if (inputs.length >= 20) return;

    const newInput = {
      type,
      title: "",
      placeholder: "",
      order: inputs.length,
      category: "",
      id: uuidv4(),
    };

    setInputs([...inputs, newInput]);
  };

  const deleteInputField = (id) => {
    setInputs(inputs.filter((input) => input.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedInputs = Array.from(inputs);
    const [movedItem] = reorderedInputs.splice(result.source.index, 1);
    reorderedInputs.splice(result.destination.index, 0, movedItem);

    const updatedInputs = reorderedInputs.map((input, index) => ({
      ...input,
      order: index,
    }));

    setInputs(updatedInputs);
  };

  useEffect(() => {
    const fetchFormById = async () => {
      try {
        if (!formId) return;

        const res = await getFormById(formId);

        if (res.status === 200) {
          const data = await res.json();
          const form = data.form;
          setFormTitle(form.title);
          setInputs(form.inputFields);
          setGroup(form.groupBy);
        } else {
          const data = await res.json();
          alert(data.error);
        }
      } catch (err) {
        alert(err.message);
      }
    };

    if (editMode) {
      fetchFormById();
    }
  }, [formId, editMode]);

  const updateInputField = (id, field, value) => {
    setInputs((prevInputs) =>
      prevInputs.map((input) =>
        input.id === id ? { ...input, [field]: value } : input
      )
    );

    if (selectedInputField && selectedInputField.id === id) {
      setSelectedInputField((prev) => ({ ...prev, [field]: value }));
    }
  };

  const createFormAPI = async () => {
    try {
      const res = await createForm({ title: formTitle, inputFields: inputs, groupBy : group });

      if (res.status === 201) {
        const data = await res.json();
        alert(data.message);
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const editFormAPI = async () => {
    try {
      const res = await editForm(formId, {
        title: formTitle,
        inputFields: inputs,
        groupBy : group
      });

      if (res.status === 200) {
        const data = await res.json();
        alert(data.message);
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const groupedInputs = () => {
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

  return (
    <div className="create-form-page">
      <img
        className="home-icon"
        src="/home.png"
        alt="home"
        onClick={() => {
          navigate("/");
        }}
      />

      <div className="heading">
        <p>Create New Form</p>
      </div>

      <div className="create-form-container">
        <div className="form-creation">
          <div className="form-title">
            <div className="title">
              {formTitle ? formTitle : "Untitled Form"}
            </div>

            <div className="edit-title-button">
              <img
                src="/edit.png"
                alt="Edit"
                onClick={() => {
                  setEditName(!editName);
                  setEditInputFieldTitle(false);
                  setAddInput(false);
                }}
              />
            </div>
          </div>

          <div className="form-input-fields">
            <div className="input-fields-container">
            <DragDropContext onDragEnd={onDragEnd}>
              {Object.entries(groupedInputs()).map(
                ([groupName, fields], groupIndex) => (
                  <div key={groupName} className="input-group">
                    {group !== "None" && (
                      <div
                        className="group-header"
                        onClick={() => toggleSection(groupName)}
                      >
                        <h3>{groupName}</h3>
                        <span>
                          {expandSections[groupName] ? (
                            <img src="/expand.png" alt="" />
                          ) : (
                            <img src="/collapse.png" alt="" />
                          )}
                        </span>
                      </div>
                    )}

                    {(group === "None" || expandSections[groupName]) && (
                      <Droppable droppableId={`inputs_list_${groupIndex}`}>
                        {(provided) => (
                          <div className="input-fields" ref={provided.innerRef}>
                            {fields.map((input, index) => (
                              <Draggable
                                key={input.id}
                                draggableId={input.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`input-wrapper ${input.type}`}
                                  >
                                    <div
                                      className="drag-button"
                                      {...provided.dragHandleProps}
                                    >
                                      <img src="/drag.png" alt="Drag" />
                                    </div>
                                    <div className="title-input-field">
                                      <p
                                        className={
                                          input.title
                                            ? input.title
                                            : "placeholder"
                                        }
                                      >
                                        {input.title
                                          ? input.title
                                          : "Enter Title"}
                                      </p>
                                    </div>
                                    <div className="action-buttons">
                                      <button
                                        onClick={() => {
                                          if (
                                            selectedInputField?.id === input.id
                                          ) {
                                            setEditInputFieldTitle(
                                              !editInputFieldTitle
                                            );
                                          } else {
                                            setEditInputFieldTitle(true);
                                            setEditName(false);
                                            setSelectedInputField(input);
                                          }
                                        }}
                                      >
                                        <img src="/edit.png" alt="" />
                                      </button>
                                      <button
                                        onClick={() =>
                                          deleteInputField(input.id)
                                        }
                                      >
                                        <img src="/delete.png" alt="" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </div>
                        )}
                      </Droppable>
                    )}
                  </div>
                )
              )}
            </DragDropContext>
            </div>

            <div
              className={`add-input-button`}
            >
              <button
                className={inputs.length >= 20 ? "disabled" : ""}
                onClick={() => setAddInput(!addInput)}
                disabled={inputs.length >= 20}
              >
                {addInput && inputs.length < 20
                  ? "CLOSE ADD INPUT"
                  : "ADD INPUT"}
              </button>
            </div>

            <div className="input-field-options">
              {addInput &&
                inputs.length < 20 &&
                inputTypes.map((type) => (
                  <button
                    className={`input-options ${type}`}
                    key={type}
                    onClick={() => addInputField(type)}
                  >
                    {type}
                  </button>
                ))}
            </div>
          </div>

          <div className="submit-button">
            <button onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} >SUBMIT</button>
          </div>
          <p className={hover ? "hover-active" : ""} >{hover ? "Appears here to submit responses !" : ""}</p>
        </div>

        <div className="form-or-input-editor">
          <div className="heading">
            <p>Form Editor</p>
          </div>

          {editName || editInputFieldTitle ? (
            <div className="editor-fields">
              {editName && (
                <div className="form-Name-editor">
                  <InputField
                    label={"Title"}
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </div>
              )}

              {editInputFieldTitle && (
                <div className="inputField-editor">
                  <div className="inputField-heading">
                    <p>{selectedInputField.type}</p>
                  </div>

                  <div className="input-form-title">
                    <InputField
                      label={"Enter Title"}
                      value={selectedInputField.title}
                      onChange={(e) =>
                        updateInputField(
                          selectedInputField.id,
                          "title",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="placeholder">
                    <InputField
                      label={"Enter Placeholder"}
                      value={selectedInputField.placeholder || ""}
                      onChange={(e) =>
                        updateInputField(
                          selectedInputField.id,
                          "placeholder",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {group === "Category" && selectedInputField && (
                    <div className="category">
                      <InputField
                        label={"Enter Category"}
                        value={selectedInputField.category || ""}
                        onChange={(e) =>
                          updateInputField(
                            selectedInputField.id,
                            "category",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p>Select to see editor</p>
          )}

          <div className="grouping-option">
            <label htmlFor="groupBy">Group By:</label>
            <select
              id="groupBy"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              <option value="None">None</option>
              <option value="Category">Category</option>
              <option value="Input Type">Input Type</option>
            </select>
          </div>
        </div>
      </div>
      <button
        onClick={() => (editMode ? editFormAPI() : createFormAPI())}
        className="create-form-button"
      >
        {editMode ? "SAVE FORM" : "CREATE FORM"}
      </button>
    </div>
  );
}

export default Create;
