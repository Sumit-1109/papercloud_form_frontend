const URL = import.meta.env.VITE_BACKEND_URL;

export const getAllForms = async () => {
    return fetch(`${URL}/api/form`, {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
        }
    });
};

export const createForm = async (inputs) => {
    return fetch(`${URL}/api/form/create`, {
        method: 'POST',
        headers : {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(inputs),
    })
}

export const getFormById = async (formId) => {
    return fetch(`${URL}/api/form/${formId}`, {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
        }
    })
}

export const editForm = async (formId, inputs) => {
    return fetch(`${URL}/api/form/edit/${formId}`, {
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(inputs),
    })
}

export const deleteForm = async (formId) => {
    return fetch(`${URL}/api/form/delete/${formId}`, {
        method: 'DELETE'
    })
}

export const sendResponse = async (inputFields) => {
    console.log(inputFields);
    return fetch(`${URL}/api/form/recieve`, {
        method: "POST",
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({inputFields}),
    })
}