import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function isNumeric(str) {
    return !isNaN(str) && !isNaN(parseInt(str))
}

const ModifySanctionForm = () => {
    const [sanctionData, setsanctionData] = useState({})
    const [materialData, setmaterialData] = useState({})
    const [quantity, setquantity] = useState('')
    const [type, settype] = useState('')
    const [messages, setmessages] = useState([])

    const sancData = (id) => {
        try {
            if (id.length == 0) {
                setsanctionData({})
                setmaterialData({})
            }
            else {
                const fetchData = async () => {
                    try {
                        const response1 = await fetch(`http://127.0.0.1:8000/api/sanctions/${id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });

                        if (!response1.ok) {
                            throw new Error(`HTTP error! Status: ${response1.status}`);
                        }

                        const data1 = await response1.json();
                        setsanctionData(data1);
                        console.log(data1);
                        console.log(data1.material);

                        const response2 = await fetch(`http://127.0.0.1:8000/api/materials/${data1.material}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });

                        if (!response2.ok) {
                            throw new Error(`HTTP error! Status: ${response2.status}`);
                        }

                        const data2 = await response2.json();
                        setmaterialData(data2);
                        console.log(data2);
                    } catch (error) {
                        setsanctionData({})
                        setmaterialData({})
                        console.error("Error fetching data:", error);
                    }
                };
                fetchData();
            }
        }
        catch (error) {
            console.log(error)
        }
    };

    const { sanct_id } = useParams()
    useEffect(() => {
        if (sanct_id !== undefined) {
            const fetchData = async () => {
                try {
                    const response1 = await fetch(`http://127.0.0.1:8000/api/sanctions/${sanct_id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response1.ok) {
                        throw new Error(`HTTP error! Status: ${response1.status}`);
                    }

                    const data1 = await response1.json();
                    setsanctionData(data1);
                    console.log(data1);
                    console.log(data1.material);

                    const response2 = await fetch(`http://127.0.0.1:8000/api/materials/${data1.material}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response2.ok) {
                        throw new Error(`HTTP error! Status: ${response2.status}`);
                    }

                    const data2 = await response2.json();
                    setmaterialData(data2);
                    console.log(data2);
                } catch (error) {
                    setsanctionData({})
                    setmaterialData({})
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }
    }, []);

    function modify_sanction() {
        console.log("modify_sanction")
        const err = []
        console.log([type, quantity, sanctionData.quantity_sanctioned])
        if (sancData == {}) {
            err.push("Invalid Sanction ID")
        }
        else if (sanctionData.closed) {
            err.push("Sanction is closed and cannot be edited")
        }
        else if (type == "head" || type == '') {
            err.push("Please select a type")
        }
        else if (!isNumeric(quantity)) {
            err.push("Invalid quantity")
        }
        else if (Number(quantity) <= 0) {
            err.push("Quantity must be greater than 0")
        }
        else if (type == "add" && materialData.quantity < Number(quantity)) {
            err.push(`Amount of material left is Insufficient. Only ${materialData.quantity} units left`)
        }
        else if (type == "return" && Number(quantity) > sanctionData.quantity_sanctioned) {
            err.push(`Amount of sanctioned material is Insufficient. Only ${sanctionData.quantity_sanctioned} units sanctioned`)
        }

        setmessages(err)
        console.log(messages)

        if (err.length == 0) {
            const submitData = async () => {
                try {
                    const response1 = await fetch(`http://127.0.0.1:8000/api/modifysanction/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            "quantity": Number(quantity),
                            "type": type,
                            "sanct_id": sanctionData.sanction_id
                        })
                    });

                    if (!response1.ok) {
                        throw new Error(`HTTP error! Status: ${response1.status}`);
                    }

                } catch (error) {
                    console.error("Error  data:", error);
                }
            };
            submitData();
        }
    }

    return (
        <div>
            <h1>{JSON.stringify(sanctionData)}</h1>
            <h1>{JSON.stringify(materialData)}</h1>
            <input type="text" name="sanct_id" id="sanct_id" className="border border-black" onChange={event => sancData(event.target.value)} defaultValue={sanct_id} />
            <select name="type" id="type" onChange={event => settype(event.target.value)}>
                <option value="head">-Choose option-</option>
                <option value="add">Add</option>
                <option value="return">Return</option>
                <option value="close">Close</option>
            </select>
            <input type="text" name="quantity" id="quantity" className="border border-black" onChange={event => setquantity(event.target.value)} />
            <button onClick={modify_sanction}>Modify</button>
            <h1>{messages[0]}</h1>
        </div>
    );
};

export default ModifySanctionForm;