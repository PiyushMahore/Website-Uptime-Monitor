import React, { useState, useEffect, useRef } from "react";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput } from 'mdb-react-ui-kit';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Loading from "../components/Loading";
import { useNavigate } from "react-router";
import { useProvider } from "../Context/UserContextProvider";

function SignUp() {
    useEffect(() => {
        import('mdb-react-ui-kit/dist/css/mdb.min.css');
    }, []);

    const useContexts = useProvider()
    const navigate = useNavigate()
    const msgRef = useRef(null)

    const [fullName, setFullName] = useState("")
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobileNumber, setMobileNumber] = useState("")
    const [coverImage, setCoverImage] = useState(null)

    const handleSignUp = async () => {
        const data = await useContexts.signUp(fullName, userName, email, password, mobileNumber, coverImage || "");
        if (data) {
            navigate("/dashboard");
        }
    };

    if (useContexts.loading) return <Loading />

    return (
        <MDBContainer fluid className="h-screen flex justify-center items-center bg-[#0B0C14]">

            <MDBRow className='flex justify-content-center align-items-center w-screen sm:p-24'>

                <MDBCard className="p-0">

                    <MDBCardBody className="bg-[#0B0C14] sm:border rounded-md">

                        <h3 ref={msgRef} className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5 text-gray-300 text-center">Registration Form</h3>

                        <MDBRow>

                            <MDBCol md='6'>
                                <MDBInput className="text-white" value={fullName} onChange={(e) => setFullName(e.target.value)} labelStyle={{ color: "#9CA3AF" }} wrapperClass='mb-4' label='Full Name' size='lg' id='form1' type='text' />
                            </MDBCol>

                            <MDBCol md='6'>
                                <MDBInput className="text-white" value={userName} onChange={(e) => setUserName(e.target.value)} labelStyle={{ color: "#9CA3AF" }} wrapperClass='mb-4' label='User Name' size='lg' id='form2' type='text' />
                            </MDBCol>

                        </MDBRow>

                        <MDBRow>

                            <MDBCol md='6'>
                                <MDBInput className="text-white" value={email} onChange={(e) => setEmail(e.target.value)} labelStyle={{ color: "#9CA3AF" }} wrapperClass='mb-4' label='Email' size='lg' id='form3' type='text' />
                            </MDBCol>

                            <MDBCol md='6'>
                                <MDBInput className="text-white" value={password} onChange={(e) => setPassword(e.target.value)} labelStyle={{ color: "#9CA3AF" }} wrapperClass='mb-4' label='Password' size='lg' id='form4' type='text' />
                            </MDBCol>

                        </MDBRow>

                        <MDBRow>

                            <MDBCol md='6' className="mb-4">
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-600 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                            </svg>
                                            <p className={`mb-2 text-sm ${coverImage !== null ? "text-white" : "text-gray-500"} dark:text-gray-400`}><span className="font-semibold">{coverImage === null ? `Click to upload Cover Image` : coverImage?.name}</span>{coverImage === null ? `or drag and drop` : ""}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                        </div>
                                        <input className="text-white hidden" onChange={(e) => setCoverImage(e.target.files[0])} id="dropzone-file" type="file" />
                                    </label>
                                </div>
                            </MDBCol>

                            <MDBCol md='6'>
                                <MDBInput className="text-white" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} labelStyle={{ color: "#9CA3AF" }} wrapperClass='mb-4' label='Phone Number' size='lg' id='form5' type='rel' />
                            </MDBCol>

                        </MDBRow>

                        <MDBBtn onClick={handleSignUp} className='mb-4' size='lg'>Submit</MDBBtn>

                    </MDBCardBody>

                </MDBCard>

            </MDBRow>
        </MDBContainer>
    );
}

export default SignUp;
