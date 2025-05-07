import "./Form.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const Form = (props) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [hasGams, setGams] = useState(false);
  const [dataContrib, setDataContrib] = useState(true);
  
  
  const active = !props.hideForm ? "active" : "";

  // const uploadFile = async (file, jobId) => new Promise(async resolve => {
  //   let urlFormData = new FormData();
  //   console.log("1")
  //   urlFormData.append("fname", jobId + "/files/" + file.name);
  //   var response = await fetch("/api/get-url", {
  //     method: "POST",
  //     body: urlFormData,
  //   });
  //   console.log("2")
  //   var url = await response.text();
  //   console.log("3")
  //   let config = {
  //     headers: {
  //       'Content-type': 'application/octet-stream',
  //     }
  //   }
    
  //   await axios.put(url, file, config);
  //   resolve();
  //   console.log("4")
  // });

  const populateForm = async (e, jobId) => {
    e.preventDefault();
    if (!props.files) {
      return;
    }
    let formData = new FormData();
    const timestamp = Date.now();
    const date = new Date(timestamp);
    var uploads = [];
    for (let i = 0; i < props.files.length; i++) {
      //uploads.push(uploadFile(files[i], jobId));
      formData.append(String(i),props.files[i],props.files[i].name)
    }
    await Promise.all(uploads).then((values) => {
      console.log(values);
    });
    formData.append("num-files", props.files.length)
    formData.append("id", jobId);
    formData.append("email-address", emailAddress);
    formData.append("has-gams", hasGams);
    formData.append("data-contrib", dataContrib);
    formData.append("date", date.toISOString());
    console.log(props.files)
    return formData;
  };

  const onFormSubmit = async (e) => {
    props.setFromForm(true)
    const jobId = uuidv4();
    props.setActive(jobId);
    populateForm(e, jobId).then(formData => props.onSubmit(formData));
  };

  return (
    <div className="ui styled fluid accordion">
      <div className={`${active} title`}>
        <span style={{ lineHeight: "28px" }}>
          <i onClick={() => props.setFormHidden(!props.hideForm)} className="dropdown icon"></i>
          Upload
        </span>
        <Link
          to="/example"
          onClick={() => props.setFormHidden(true)}
          className="ui mini right floated basic button"
        >
          Load example
        </Link>
      </div>
      <div className={`${active} content`}>
        <form onSubmit={onFormSubmit} className="ui form">
          <div className="field">
            <label>
              Email address&nbsp;
              <span
                data-tooltip="We will send you an email once your results are ready."
                data-variation="mini"
              >
                <i className="info circle icon"></i>
              </span>
            </label>
            <input
              type="text"
              name="email-address"
              placeholder="Email address"
              onChange={(e) => setEmailAddress(e.target.value)}
              value={emailAddress}
            />
          </div>
          <div className="field">
            <label>Malaria Species</label>
            <select className="ui fluid disabled dropdown">
              <option value="falciparum" placeholder="Plasmodium falciparum">
                Plasmodium falciparum
              </option>
            </select>
          </div>
          <div className="field">
            <div className="ui checkbox">
              <input
                type="checkbox"
                checked={hasGams}
                onChange={() => setGams(!hasGams)}
              />
              <label>Contains gametocytes (beta)</label>
            </div>
          </div>
          <div className="field">
            <label>Giemsa stain images</label>
            <input
              type="file"
              onChange={(e) => props.setFiles(e.target.files)}
              multiple
            />
            <div className="description">.jpg or .png recommended, .tiff may cause delays</div>
          </div>
          <div className="field">
            <div className="ui checkbox">
              <input
                type="checkbox"
                checked={dataContrib}
                onChange={() => setDataContrib(!dataContrib)}
              />
              <label>
                I'd like to contribute my data to improve this website.
              </label>
            </div>
          </div>
          <button className="ui button" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
