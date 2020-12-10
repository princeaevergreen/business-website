import React, { useState, useReducer, useCallback } from "react"
import { graphql } from "gatsby"
import { RiSendPlane2Line } from "react-icons/ri"
import axios from "axios"

import Layout from "../components/layout"
import SEO from "../components/seo"
import CustomTextInput from "../components/CustomTextField/CustomTextInput"

export const pageQuery = graphql`
  query ContactQuery($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt(pruneLength: 140)
      frontmatter {
        title
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`

const formTypes = {
  FORM_INPUT_UPDATE: "FORM_INPUT_UPDATE",
  FORM_INPUT_RESET: "FORM_INPUT_RESET",
}

const formReducer = (state, action) => {
  if (action.type === formTypes.FORM_INPUT_UPDATE) {
    const updatedInputValues = {
      ...state.inputValues,
      [action.input]: action.value,
    }
    const updatedInputValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    }
    let updatedFormIsValid = true
    for (let key in updatedInputValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedInputValidities[key]
    }

    return {
      ...state,
      inputValues: updatedInputValues,
      inputValidities: updatedInputValidities,
      formIsValid: updatedFormIsValid,
    }
  }
  return state
}

const Contact = ({ data }) => {
  const { markdownRemark, site } = data // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark
  // const [name, setName] = useState("")
  // const [email, setEmail] = useState("")
  // const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [formError, setFormError] = useState("");
  const [formSent, setFormSent] = useState("");

  const [formState, dispatchForForm] = useReducer(formReducer, {
    inputValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    inputValidities: {
      name: false,
      email: false,
      subject: false,
      message: false,
    },
    formIsValid: false,
  })

  //console.log(formState)

  const inputChangeHandler = useCallback(
    (id, inputValue, inputValidity) => {
      setFormSent("");
      setFormError("");
      dispatchForForm({
        type: formTypes.FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: id,
      })
    },
    [dispatchForForm]
  )

  // const nameChangeHandler = e => {
  //   setName(e.target.value)
  // }

  // const emailChangeHandler = e => {
  //   setEmail(e.target.value)
  // }

  // const subjectChangeHandler = e => {
  //   setSubject(e.target.value)
  // }

  const messageChangeHandler = e => {
    setMessage(e.target.value);
    inputChangeHandler("message", e.target.value, true);
  }

  const submitHandler = async event => {
    event.preventDefault()
    //console.log(formState)
    if (!formState.formIsValid) {
      setFormError("Form filled incorrectly")
      return //show an error message
    }
    setFormError("")
    try {
      const messageBody = {
        email: formState.inputValues.email,
        subject: formState.inputValues.subject,
        name: formState.inputValues.name,
        message: formState.inputValues.message,
      }
      await axios.post("https://princeaevergreen-api.herokuapp.com/forwardmailgun", messageBody)
      setFormSent("Message sent succesfully");
    } catch (error) {
      //console.log({error})
      setFormSent("");
      setFormError("Error sending message");
    }
  }
  return (
    <Layout className="contact-page">
      <SEO
        title={frontmatter.title}
        description={frontmatter.title + " " + site.siteMetadata.title}
      />
      <div className="wrapper">
        <h1>{frontmatter.title}</h1>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <form
          className="contact-form"
          //action="/thanks"
          name="contact"
          //method="POST"
          // data-netlify="true"
          // data-netlify-honeypot="bot-field"
          onSubmit={submitHandler}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p>
            <label>
              Name
              <CustomTextInput
                id="name"
                type="text"
                name="name"
                //value={name}
                //onChange={nameChangeHandler}
                required
                errorMessage="Please enter a valid name"
                onInputChange={inputChangeHandler}
              />
            </label>
          </p>
          <p>
            <label>
              Email
              <CustomTextInput
                id="email"
                type="email"
                name="email"
                required
                //value={email}
                errorMessage="Please enter a valid email"
                //onChange={emailChangeHandler}
                onInputChange={inputChangeHandler}
                email
              />
            </label>
          </p>
          <p>
            <label>
              Subject
              <CustomTextInput
                id="subject"
                type="text"
                name="subject"
                //value={subject}
                //onChange={subjectChangeHandler}
                errorMessage="Subject must be aa minimum of 5 characters"
                onInputChange={inputChangeHandler}
                required
                minLength={5}
              />
            </label>
          </p>
          <p>
            <label>
              Message
              <textarea
                name="message"
                required
                value={message}
                onChange={messageChangeHandler}
              ></textarea>
            </label>
          </p>
          {formError && (
            <p className="text-align-center" style={{ color: "red" }}>
              {formError}
            </p>
          )}
          {formSent && (
            <p className="text-align-center" style={{ color: "blue" }}>
              {formSent}
            </p>
          )}
          <p className="text-align-right">
            <button className="button" type="submit">
              Send Message{" "}
              <span className="icon -right">
                <RiSendPlane2Line />
              </span>
            </button>
          </p>
        </form>
      </div>
    </Layout>
  )
}

export default Contact
