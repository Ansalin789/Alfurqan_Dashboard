'use client';

import Image from 'next/image';
import { useState } from 'react';
import DatePicker from 'react-date-picker'; // Import the date picker component

export default function MultiStepForm() {
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        email: "",
        number: "",
        country: "",
        useFor: "",
        students: 0,
        teacherPreference: "",
        learnedFrom: "",
        date: new Date(), // Default to current date
        time: ""
    });

    const nextStep = () => {
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length === 0) {
            setStep(prev => prev + 1);
        } else {
            setErrors(validationErrors);
        }
    };
    const prevStep = () => setStep(prev => prev - 1);

    const handleChange = (input: string) => (e: { target: { value: any; }; }) => {
        setFormData({ ...formData, [input]: e.target.value });
    };

    const handleDateChange = (date: any) => {
        setFormData({ ...formData, date });
    };

    const handleTimeSelect = (time: string) => {
        setFormData({ ...formData, time });
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // Submit form logic
    };

    const validateFields = () => {
        const errors: any = {};
        if (step === 1) {
            if (!formData.fname) errors.fname = "First Name is required";
            if (!formData.lname) errors.lname = "Last Name is required";
            if (!formData.email) errors.email = "Email is required";
            if (!formData.number) errors.number = "Number is required";
            if (!formData.country) errors.country = "Country is required";
        } else if (step === 2) {
            if (!formData.useFor) errors.useFor = "Usage is required";
            if (formData.students === 0) errors.students = "Students number is required";
            if (!formData.teacherPreference) errors.teacherPreference = "Teacher preference is required";
            if (!formData.learnedFrom) errors.learnedFrom = "Information source is required";
        }
        return errors;
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mt-8">Let's get your Journey Started</h2>
            <form
                className="p-10 bg-[#fff] w-[100%] max-w-3xl border rounded-lg mt-4"
                onSubmit={handleSubmit}
                autoComplete="off"
            >
                {/* Step Indicator */}
                <div className="flex justify-around items-center mb-8">
                    {['Step 1', 'Step 2', 'Step 3'].map((label, index) => {
                        const isActive = step === index + 1;
                        const isCompleted = step > index + 1;
                        return (
                            <div key={label} className="flex items-center">
                                {/* Step circle */}
                                <div
                                    className={`w-8 h-8 flex justify-center items-center rounded-full ${
                                        isActive ? 'bg-green-500 text-white' : isCompleted ? 'bg-green-300 text-white' : 'bg-gray-300'
                                    }`}
                                >
                                    {isCompleted ? '✔' : index + 1}
                                </div>

                                {/* Step label */}
                                <span
                                    className={`ml-2 ${isActive ? 'font-semibold text-green-600' : 'text-gray-500'}`}
                                >
                                    {label}
                                </span>

                                {/* Connector line */}
                                {index < 2 && (
                                    <div className={`flex-1 h-1 mx-2 ${step > index + 1 ? 'bg-green-500' : 'bg-gray-300'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
                <div>
                <div className='flex p-5'>
                    <div className='align-middle'>
                    <Image src="/assets/images/alf2.png" className='pr-5' width={130} height={50} alt='logo'/>
                    </div>
                    <div className='grid align-middle'>
                        <h1 className="text-lg font-semibold mb-4 text-center">Start Your Journey</h1>
                        {/* <p className='text-start'>Start Your Journey</p> */}
                    </div>
                </div>
                
                </div>

                {/* Step 1 */}
                {step === 1 && (
                    <div>
                        <h4>Name</h4>

                        <div className='flex gap-2'>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="First Name"
                                className="w-full p-3 border-b-2 border-b-[#4b93fa] bg-[#4992fa1a] rounded"
                                value={formData.fname}
                                onChange={handleChange('fname')}
                            />
                            {errors.fname && <p className="text-red-500 text-sm">{errors.fname}</p>}
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="w-full p-3 border-b-2 border-b-[#4b93fa] bg-[#4992fa1a] rounded"
                                value={formData.lname}
                                onChange={handleChange('lname')}
                            />
                            {errors.lname && <p className="text-red-500 text-sm">{errors.lname}</p>}
                        </div>
                        </div>
                        
                        <div className="mb-4">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-3 border-b-2 border-b-[#4b93fa] bg-[#4992fa1a] rounded"
                                value={formData.email}
                                onChange={handleChange('email')}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        <div className="mb-4">
                            <input
                                type="number"
                                placeholder="Number"
                                className="w-full p-3 border-b-2 border-b-[#4b93fa] bg-[#4992fa1a] rounded"
                                value={formData.number}
                                onChange={handleChange('number')}
                            />
                            {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
                        </div>
                        <div className="mb-4">
                            <select
                                className="w-full p-3 border-b-2 border-b-[#4b93fa] bg-[#4992fa1a] rounded"
                                value={formData.country}
                                onChange={handleChange('country')}
                            >
                                <option value="">Please Select Your Country</option>
                                <option value="India">India</option>
                                <option value="USA">USA</option>
                                <option value="Germany">Germany</option>
                                <option value="Qatar">Qatar</option>
                            </select>
                            {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                        </div>
                        <button type="button" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={nextStep}>
                            Next
                        </button>
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <div className='justify-center align-middle'>
                        <h3 className="text-lg font-semibold mb-4">Why Alfurqan</h3>
                        
                        <div className="mb-6">
                            <p className="font-semibold mb-2">What will you use IQRA for?</p>
                            <div className="flex gap-2">
                                {['Quran', 'Islamic Studies', 'Arabic', 'Other'].map(option => (
                                    <button
                                        type="button"
                                        key={option}
                                        className={`py-2 px-4 rounded border ${formData.useFor === option ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300'}`}
                                        onClick={() => setFormData({...formData, useFor: option})}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            {errors.useFor && <p className="text-red-500 text-sm">{errors.useFor}</p>}
                        </div>

                        <div className="mb-6">
                            <p className="font-semibold mb-2">How many students will join?</p>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(number => (
                                    <button
                                        type="button"
                                        key={number}
                                        className={`py-2 px-4 rounded-full border ${formData.students === number ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300'}`}
                                        onClick={() => setFormData({...formData, students: number})}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>
                            {errors.students && <p className="text-red-500 text-sm">{errors.students}</p>}
                        </div>

                        <div className="mb-6">
                            <p className="font-semibold mb-2">For your evaluation, do you prefer?</p>
                            <div className="flex gap-2">
                                {['Male Teacher', 'Female Teacher', 'Either Teacher'].map(preference => (
                                    <button
                                        type="button"
                                        key={preference}
                                        className={`py-2 px-4 rounded border ${formData.teacherPreference === preference ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300'}`}
                                        onClick={() => setFormData({...formData, teacherPreference: preference})}
                                    >
                                        {preference}
                                    </button>
                                ))}
                            </div>
                            {errors.teacherPreference && <p className="text-red-500 text-sm">{errors.teacherPreference}</p>}
                        </div>

                        <div className="mb-6">
                            <p className="font-semibold mb-2">How did you hear about us?</p>
                            <div className="flex gap-2">
                                {['Google', 'Instagram', 'Facebook', 'Friend', 'Relative', 'Other'].map(source => (
                                    <button
                                        type="button"
                                        key={source}
                                        className={`py-2 px-4 rounded border ${formData.learnedFrom === source ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300'}`}
                                        onClick={() => setFormData({...formData, learnedFrom: source})}
                                    >
                                        {source}
                                    </button>
                                ))}
                            </div>
                            {errors.learnedFrom && <p className="text-red-500 text-sm">{errors.learnedFrom}</p>}
                        </div>

                        <div className="flex justify-between">
                            <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600" onClick={prevStep}>
                                Previous
                            </button>
                            <button type="button" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={nextStep}>
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Schedule your class</h3>
                        
                        <div className="mb-6">
                            <label className="block mb-2 font-semibold">Choose a Date:</label>
                            <DatePicker
                                onChange={handleDateChange}
                                value={formData.date}
                                className="w-full p-3 border rounded"
                            />
                        </div>

                        {formData.date && (
                            <div className="mb-6">
                                <label className="block mb-2 font-semibold">Choose a Time:</label>
                                <div className="flex flex-wrap gap-2">
                                    {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'].map(time => (
                                        <button
                                            type="button"
                                            key={time}
                                            className={`py-2 px-4 rounded border ${formData.time === time ? 'bg-green-100 border-green-500 text-green-700' : 'bg-gray-100 border-gray-300'}`}
                                            onClick={() => handleTimeSelect(time)}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between">
                            <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600" onClick={prevStep}>
                                Previous
                            </button>
                            <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
