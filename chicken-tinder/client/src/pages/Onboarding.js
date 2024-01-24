import { useState } from 'react';
import Nav from '../components/Nav';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Onboarding = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [formData, setFormData] = useState({
        user_id: "",
        first_name: "",
        dob_day: "",
        dob_month: "",
        dob_year: "",
        email: "",
        url: "",
        about: "",
        matches: [],
        gender_identity: 'woman',
    })

    let navigate = useNavigate()

    const handleSubmit = async (e) => {
        console.log('submitted')
        e.preventDefault()
        try{
            const response = await axios.put('http://localhost:8000/user', {formData}) 
            console.log(response)

            const success = response.status === 200
            if (success) navigate('/discovery')
        } catch (err) {
            console.log(err)
        }

    }

    const handleChange = (e) => {
        console.log('e', e)
        const value = e.target.value
        const name = e.target.name
        console.log(value, name)

        setFormData((prevState) => ({
            ...prevState,
            matches: [],
            [name] : value
        }))
    }

    console.log(formData)

    return (
        <>
            <Nav
                minimal={true} 
                setShowModal={() => {}} 
                showModal={false} 
            />
            <div className="onboarding">
                <h2>CREATE ACCOUNT</h2>
                <form onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="first_name">First Name</label>
                        <input
                            id="first_name"
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            required={true}
                            value={formData.first_name}
                            onChange={handleChange}
                        />

                        <label>Birthday</label>
                        <div className={"multiple-input-container"}>
                        <input
                            id="dob_day"
                            type="number"
                            name="dob_day"
                            placeholder="DD"
                            required={true}
                            value={formData.dob_day}
                            onChange={handleChange}
                        />

                        <input
                            id="dob_month"
                            type="number"
                            name="dob_month"
                            placeholder="MM"
                            required={true}
                            value={formData.dob_month}
                            onChange={handleChange}
                        />

                        <input
                            id="dob_year"
                            type="number"
                            name="dob_year"
                            placeholder="YYYY"
                            required={true}
                            value={formData.dob_year}
                            onChange={handleChange}
                        />  
                        </div>
        
                        <label>Gender</label>
                        <div className={"multiple-input-container"}>
                        <input
                            id="man_gender_identity"
                            type="radio"
                            name="gender_identity"
                            required={true}
                            value={"man"}
                            onChange={handleChange}
                            checked={formData.gender_identity === 'man'}
                        />
                        <label htmlFor="man_gender_identity">Man</label>
                        <input
                            id="woman_gender_identity"
                            type="radio"
                            name="gender_identity"
                            required={true}
                            value={"woman"}
                            onChange={handleChange}
                            checked={formData.gender_identity === 'woman'}
                        />
                        <label htmlFor="woman_gender_identity">Woman</label>
                        <input
                            id="nonbinary_gender_identity"
                            type="radio"
                            name="gender_identity"
                            required={true}
                            value={"nonbinary"}
                            onChange={handleChange}
                            checked={formData.gender_identity === 'nonbinary'}
                        />
                        <label htmlFor="nonbinary_gender_identity">Non Binary</label>
                        </div>

                        <label htmlFor="about">About Me</label>
                        <input 
                            id="about"
                            type="text"
                            name="about"
                            required={true}
                            placeholder="I love Chinese food..."
                            value={formData.about}
                            onChange={handleChange}
                        />
                        <input type="Submit"/>
                    </section>

                    <section>
                        <label htmlFor=''>Profile Photo</label>
                            <input
                                type="url"
                                name="url"
                                id="url"
                                onChange={handleChange}
                                required={true}
                            />
                            <div className="photo-container">
                                <img src={formData.url} alt="profile pic preview" />
                            </div>
                    </section>
                </form>
            </div>
        </>
    )
}

export default Onboarding