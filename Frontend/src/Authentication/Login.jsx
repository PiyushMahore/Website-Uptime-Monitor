import React, { useEffect, useRef, useState } from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { MDBBtn, MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBIcon } from 'mdb-react-ui-kit';
import { NavLink, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading';
import { useProvider } from '../Context/UserContextProvider';

function Login() {
    useEffect(() => {
        import('mdb-react-ui-kit/dist/css/mdb.min.css');
    }, []);

    const msgRef = useRef(null)
    const navigate = useNavigate()
    const useContexts = useProvider()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const logIn = async () => {
        const data = await useContexts.login(email, password)
        if (data) {
            navigate(`/dashboard/${data.data._id}`)
        }
    }
    console.log(email, password)

    if (useContexts.loading) return <Loading />

    return (
        <MDBContainer fluid className='h-screen bg-[#0B0C14]'>

            <MDBRow className='d-flex justify-content-center align-items-center h-100'>
                <MDBCol col='12'>

                    <MDBCard className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
                        <MDBCardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>

                            <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                            <p ref={msgRef} className="text-white-50 mb-5">Please enter your login and password!</p>

                            <MDBInput value={email} onChange={(e) => setEmail(e.target.value)} wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Email address' id='formControlLg1' type='email' size="lg" />
                            <MDBInput value={password} onChange={(e) => setPassword(e.target.value)} wrapperClass='mb-4 mx-5 w-100' labelClass='text-white' label='Password' id='formControlLg2' type='password' size="lg" />

                            <p className="small mb-3 pb-lg-2"><a className="text-white-50" href="#!">Forgot password?</a></p>
                            <MDBBtn onClick={logIn} outline className='mx-2 px-5' color='white' size='lg'>
                                Login
                            </MDBBtn>

                            <div className='d-flex flex-row mt-3 mb-5'>
                                <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                                    <MDBIcon fab icon='facebook-f' size="lg" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                                    <MDBIcon fab icon='twitter' size="lg" />
                                </MDBBtn>

                                <MDBBtn tag='a' color='none' className='m-3' style={{ color: 'white' }}>
                                    <MDBIcon fab icon='google' size="lg" />
                                </MDBBtn>
                            </div>

                            <div>
                                <p className="mb-0">Don't have an account? <NavLink to='/sign-up' className="text-white-50 fw-bold">Sign Up</NavLink></p>
                            </div>
                        </MDBCardBody>
                    </MDBCard>

                </MDBCol>
            </MDBRow>

        </MDBContainer>
    );
}

export default Login;