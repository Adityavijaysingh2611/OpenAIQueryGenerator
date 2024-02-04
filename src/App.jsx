import React, { useState } from "react";
import {OpenAI} from "openai"
import Select from "react-select";
import "./App.css";

var openai = new OpenAI({
  apiKey: import.meta.env.VITE_Open_AI_Key,
  dangerouslyAllowBrowser: true,
});


const options = [
  { value: "MongoDB", label: "MongoDB" },
  { value: "SQL", label: "SQL" },
  { value: "PostgreSQL", label: "PostgreSQL" },
  { value: "Firebase", label: "Firebase" },
  { value: "GraphQL", label: "GraphQL" },
  { value: "DynamoDB", label: "DynamoDB" },
];

function App() {  
  const [database,setDatabase]=useState('')
  const [query,setQuery]=useState('')
  const [result,setResult]=useState('')
  const [copied,setCopied]=useState(false)
  const [valid,setValid]=useState(
    {
      db:false,
      query:false
    }
  )

  const getDB=(selected)=>{
    setDatabase(selected.value);
    setValid({db:true,query:valid.query})
    setCopied(false)
  };

  const getQuery=(e)=>{
    setQuery(e.target.value);
    setValid({db:valid.db, query: e.target.value.length ===0 ?false:true,})
    setCopied(false)

  };


  const generateQuery = async () => {

    try {
  
      let finalQuery = `create a ${database} request to  ${query.charAt(0).toLowerCase() + query.slice(1)}: only give the query code without any explaination or anything`;
  
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", 
        messages: [{
          "role": "user", 
          "content": finalQuery
        }],
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      });
  
      setResult(response.choices[0].message.content);
  
    } catch (err) {
  
      console.error('Error generating query:', err);
      setResult('An error occurred. Please try again.');
  
    }
  
  };

  return (
    <div className="App">
      <h1>Database Query Generator!</h1>
      <div className="app-inner">
        <Select
          placeholder="Select Your Database.."
          options={options}
          className="react-select"
           onChange={ getDB}
        />

        <textarea
          rows={4}
          className="query-input"
          onChange={getQuery}
          placeholder={`Enter your Database Query. \n\nFor Example, find all users who live in California and have over 1000 credits..`}
        />

        <button disabled={valid.db && valid.query ?false:true} onClick={generateQuery} className="generate-query">Generate Query</button>
        
        <div className="result-text">
          <button disabled={result.length ===0 ?true:false} onClick={()=>{
            navigator.clipboard.writeText(result);
            setCopied(true);
          }}
          
          className="copy-btn">{copied ?"copied":"copy"}</button>
          <h4>{result}</h4>
        </div>
      </div>
    </div>
  );
}

export default App;


// const generateQuery=async ()=>{

  //   let finalQuery=`create a ${database} request to only sql code for ${query.charAt(0).toLowerCase() + query.slice(1)}:`; 
    
  //   const response=await openai.chat.completions.create({
  //     model:"gpt-3.5-turbo",
  //     messages:[{"role":"user", "content":finalQuery}],
  //     temperature: 0.7,
  //     max_tokens: 64,
  //     top_p: 1,
      
  //   });
  //   // console.log('API Response:', response); 
  //   setResult(response.choices[0].message.content);

  // };

