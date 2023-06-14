import React, { useState, useEffect } from 'react'
// import { IPFSHTTPClient } from 'ipfs-http-client';
// import { NFTStorage } from 'nft.storage';
import * as AiIcons from 'react-icons/ai';
const ipfsClient = require("ipfs-http-client")
const projectId = 'sustabli';
const projectSecret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI1RjQ1MzdDNjhCOWY0Y0E1Y0QwNkJFRDM3MUQ3MmZFQUU3ZUJkY0IiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4NjUwNDI3OTQ3NywibmFtZSI6InN1c3RhYmxpIn0.45_OXWPFBcVjz0zBg0Em40motvm21tAnx8zljmOXfq0';
// const NFT_STORAGE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI1RjQ1MzdDNjhCOWY0Y0E1Y0QwNkJFRDM3MUQ3MmZFQUU3ZUJkY0IiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4NjUwNDI3OTQ3NywibmFtZSI6InN1c3RhYmxpIn0.45_OXWPFBcVjz0zBg0Em40motvm21tAnx8zljmOXfq0';
const auth ='Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});
// const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

const AddProduct = ({ addProduct, onAdd}) => {
    
    const [name, setName] = useState("")
    const [processes, setProcesses] = useState([""])
    const [buffer, setBuffer] = useState("")
    const [date, setDate] = useState("")
    const [d, setD] = useState("")

    const captureFile = async (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
    
        reader.onloadend = async (e) => {
            await convertToBuffer(reader)
        }    
    }

    const convertToBuffer = async(reader) => {
        //file is converted to a buffer to upload to IPFS
          const buffer = Buffer.from(reader.result)
        //set this buffer -using es6 syntax
          setBuffer(buffer)
          console.log(buffer)
        }

    useEffect(() => {
        getDate()
    }, [d])
    
    const getDate = async () => {
        const today = new Date()
        const d = await today.getDate() +'-'+ (today.getMonth()+1) +'-'+ today.getFullYear()
        const t = await today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        const date = await d + " " + t
        setDate(date)
        console.log(date)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        console.log("submitting...")
        const result = await client.add(buffer)
        console.log("Ipfs result", result)
        const image = result.path
        const process = await JSON.stringify(processes)
        console.log(process)
        setD("now")
        addProduct({name, image, process, date})
    }

    const handleAddField = () => {
        setProcesses([...processes, ""])
    }

    const handleChangeInput = (id, event) => {
        const values = [...processes];
        values[id] = event.target.value;
        setProcesses(values);
      }

    const handleRemoveField = (id) => {
        const values  = [...processes];
        values.splice(id, 1);
        setProcesses(values);   
     }

    return (
        <div className="center">
            <form className="product-form" onSubmit={onSubmit}>
            <div className="product-form-header">
                <h2>Add Product</h2>
                <button className="btn form-close" style= {{background:"red", fontSize:"14px"}} onClick={onAdd}>X</button>
            </div>
            <div className="product-center-form">
                <div className="form-inputs">
                    <label>Image</label>
                    <input 
                        type="file"
                        className="product"
                        placeholder="Upload an Image"
                        onChange={captureFile}
                        />
                </div>
                <div></div>                
                <div className="form-inputs">
                    <label>Product Name</label>
                    <input 
                        type="text"
                        className="product" required
                        placeholder="Enter Product Name"
                        value = {name} onChange={(e) => setName(e.target.value)}
                        />
                </div>
                <h3>Product Production Processes</h3>
                {processes.map((c, id) => {
                    return(
                <div className="form-inputs" key={id}>
                    <input
                        name='process'
                        className="process-add" required
                        placeholder="Enter Product Production Process"
                        value= {c} onChange={(e) => handleChangeInput(id, e)}
                        /><AiIcons.AiOutlinePlusCircle className="add" onClick= {handleAddField}/>
                        {processes.length !== 1 ? <AiIcons.AiOutlineMinusCircle className="add" onClick= {() => handleRemoveField(id)}/> : null}

                </div>
                )})}
                <div></div>
                <button className="btn product-input-btn" type="submit">
                    Add
                </button>
            </div>
            </form>
        </div>
    )
}

export default AddProduct

    
