'use client';

import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Image from 'next/image';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import { getCountries } from 'react-phone-number-input/input'
import en from 'react-phone-number-input/locale/en.json'

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];


interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    number: string;
    country: string;
    iqraUsage: string[]; // Explicitly typed as an array of strings
    studentsCount: string | number; // Mixed type to handle different states
    teacherPreference: string;
    referralSource: string;
    referralSourceOther: string;
    trialDate: Date;
    trialTime: string;
    iqraUsageOther: string; // Add this new field
}

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        number: '',
        country: '',
        iqraUsage: [], // Default empty array
        studentsCount: '',
        teacherPreference: '',
        referralSource: '',
        referralSourceOther: '',
        trialDate: new Date(),
        trialTime: '',
        iqraUsageOther: '', // Add this new field
    });
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePhoneChange = (value: string) => {
        setFormData({
            ...formData,
            number: value,
        });
    };

    const handleDateChange = (value: Value) => {
        if (value instanceof Date) {
            setFormData({
                ...formData,
                trialDate: value,
            });
            loadAvailableTimes();
        }
    };

    const loadAvailableTimes = () => {
        const times = ["2:45 AM", "3:00 AM", "3:15 AM", "3:30 AM", "3:45 AM", "4:00 AM"];
        setAvailableTimes(times);
    };

    const handleTimeSelect = (time: string) => {
        setFormData({
            ...formData,
            trialTime: time,
        });
    };

    const handleMultiSelectOptionChange = (field: keyof Pick<FormData, 'iqraUsage'>, value: string) => {
        setFormData((prev) => {
            const currentSelection = prev[field];
            if (currentSelection.includes(value)) {
                return {
                    ...prev,
                    [field]: currentSelection.filter((option) => option !== value),
                };
            }
            return {
                ...prev,
                [field]: [...currentSelection, value],
            };
        });
    };

    const handleSingleSelectOptionChange = (field: keyof FormData, value: string | number) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);
    };

    const isTileDisabled = ({ date }: { date: Date }): boolean => {
        return date < new Date();
    };
    const [startDate, setStartDate] = useState(new Date());
    const [time, setTime] = useState('12:00');

    return (
        <div className="max-w-[40%] mx-auto justify-center mt-10 p-6 rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)] bg-gray-100">
            <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium">Contact</div>
                <div className="text-sm font-medium">{step * 33}%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div className="bg-[#293552] h-2.5 rounded-full" style={{ width: `${step * 33}%` }}></div>
            </div>


            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div>
                                    <div className="flex items-center justify-center mb-4 p-6">
                <Image src="/assets/images/alf.png" alt="Logo" width={160} height={160} className="mr-10" />
                {/* <div>
                    <h2 className="text-2xl font-bold">أهلا ومرحبا</h2>
                </div> */}
            </div>
                        <label className="block mb-2 font-semibold">First / Last name</label>
                        <div className="flex gap-4 mb-4">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100"
                            />
                        </div>
                        <div className="flex gap-4 mb-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100"
                            />
                        </div>
                        <div className="flex gap-4 mb-4">
                            <div className="w-1/2">  {/* Phone input wrapper */}
                                <PhoneInput
                                    country={'us'}
                                    value={formData.number}
                                    onChange={handlePhoneChange}
                                    inputClass="w-full p-3 py-6 rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100"
                                    containerClass="w-full"
                                    buttonStyle={{ backgroundColor: 'rgb(243 244 246)', borderColor: '#e5e7eb' }}
                                    inputStyle={{ backgroundColor: 'rgb(243 244 246)', width: '100%', borderColor: '#e5e7eb'  }}
                                    placeholder="Phone Number"
                                />
                            </div>
                            <div className="w-1/2">  {/* Country select wrapper */}
                                <select
                                    className="w-full p-3 border rounded appearance-none focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                >
                                    <option value="">Please Select Your Country</option>
                                    {getCountries().map((country) => (
                                        <option key={country} value={country}>
                                            {en[country]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={nextStep}
                            className="justify-end ml-[240px] text-[20px] p-10 align-middle py-4 bg-[#293552] text-white font-semibold hover:shadow-inner rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)]"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <button type="button" onClick={prevStep} className="text-gray-500 mb-4">←Back</button>
                        <h2 className="text-lg text-center font-bold mb-4 text-[#293552]">What will you use IQRA for?</h2>
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            {['Quran', 'Islamic Studies', 'Arabic', 'Other'].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleMultiSelectOptionChange('iqraUsage', option)}
                                    className={`p-4 rounded hover:shadow-inner rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)] ${
                                        formData.iqraUsage.includes(option) ? 'bg-[#3c85fa2e]' : 'bg-gray-100'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        
                        {formData.iqraUsage.includes('Other') && (
                            <div className="mb-6">
                                <input
                                    type="text"
                                    name="iqraUsageOther"
                                    placeholder="Please specify your course"
                                    value={formData.iqraUsageOther}
                                    onChange={handleChange}
                                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100"
                                />
                            </div>
                        )}

                        <h2 className="text-lg text-center font-bold mb-4 text-[#293552]">How many students will join?</h2>
                        <div className="grid grid-cols-5 gap-4 mb-6 rounded-br-[30px] rounded-tl-[30px] rounded-bl-[8px] rounded-tr-[8px]">
                            {[1, 2, 3, 4, 5].map((count) => (
                                <button
                                    key={count}
                                    type="button"
                                    onClick={() => handleSingleSelectOptionChange('studentsCount', count)}
                                    className={`p-4 rounded hover:shadow-inner rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)] ${
                                        formData.studentsCount === count ? 'bg-[#3c85fa2e]' : 'bg-gray-100'
                                    }`}
                                >
                                    {count}
                                </button>
                            ))}
                        </div>

                        <h2 className="text-lg text-center font-bold mb-4 text-[#293552]">Which teacher would you like?</h2>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {['Male', 'Female', 'No Preference'].map((preference) => (
                                <button
                                    key={preference}
                                    type="button"
                                    onClick={() => handleSingleSelectOptionChange('teacherPreference', preference)}
                                    className={`p-4 rounded hover:shadow-inner rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)] ${
                                        formData.teacherPreference === preference ? 'bg-[#3c85fa2e]' : 'bg-gray-100'
                                    }`}
                                >
                                    {preference}
                                </button>
                            ))}
                        </div>
                        <div className='flex gap-10 justify-center mt-8'>
                            <div className='p-4 ml-4 rounded hover:shadow-inner rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)] bg-gray-100'>
                                <h2 className="text-lg text-center font-bold mb-4 text-[#293552]">When do you want to start <br />  the classes?</h2>
                                <div className=" gap-4 mb-6 mt-6 align-middle justify-center text-center">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        className="p-2 align-middle text-center text-[#fff] justify-center border border-gray-300 rounded-md bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#293552] w-1/2"
                                        dateFormat="yyyy/MM/dd"
                                    />
                                </div>
                            </div>
                            
                            <div className='p-4 rounded hover:shadow-inner rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)] bg-gray-100'>
                                <h2 className="text-lg text-center font-bold mb-4 text-[#293552]">Preferred Time to start <br />  the classes?</h2>
                                <div className="flex items-center mt-6 justify-center mb-6">
                                    <TimePicker
                                        onChange={setTime}
                                        value={time}
                                        clockIcon={null}
                                        clearIcon={null}
                                        className="react-time-picker-custom bg-[#293552] rounded-sm border-none text-[#b4b1b1]"
                                        format="h:mm a"
                                        hourPlaceholder="hh"
                                        minutePlaceholder="mm"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='mt-6'>
                            <h2 className="text-lg text-center font-bold mb-4 text-[#293552]">Where did you hear about IQRA?</h2>
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                {['Google', 'Facebook', 'Friend', 'Other'].map((source) => (
                                    <button
                                        key={source}
                                        type="button"
                                        onClick={() => handleSingleSelectOptionChange('referralSource', source)}
                                        className={`p-4 rounded hover:shadow-inner rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)] ${
                                            formData.referralSource === source ? 'bg-[#3c85fa2e]' : 'bg-gray-100'
                                        }`}
                                    >
                                        {source}
                                    </button>
                                ))}
                            </div>
                            
                            {formData.referralSource === 'Other' && (
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        name="referralSourceOther"
                                        placeholder="Please specify where you heard about us"
                                        value={formData.referralSourceOther}
                                        onChange={handleChange}
                                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100"
                                    />
                                </div>
                            )}
                        </div>

                        
                        
                        

                        <button
                            type="button"
                            onClick={nextStep}
                            className="justify-center mt-10 text-center ml-[240px] text-[20px] p-8 align-middle py-4 bg-[#293552] text-white font-semibold  transition-all rounded hover:shadow-inner rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)]"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className='p-6 bg-white rounded-3xl'>
                        <button 
                            type="button" 
                            onClick={prevStep} 
                            className="text-gray-500 mb-4 hover:text-gray-700 transition-colors"
                        >
                            ← Back
                        </button>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-[#293552]">Select a Date and Time</h2>
                            <p className="text-gray-600 mt-2">Choose your preferred schedule</p>
                        </div>

                        <div className="grid md:grid-cols-1 gap-8">
                            {/* Calendar Section */}
                            <div className="p-6 rounded-[20px] shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
                                <Calendar
                                    onChange={handleDateChange}
                                    value={formData.trialDate}
                                    tileDisabled={isTileDisabled}
                                    className="mx-auto custom-calendar" // We'll add custom CSS for this
                                    tileClassName={({ date, view }) => 
                                        view === 'month' && date.toDateString() === formData.trialDate.toDateString() 
                                        ? 'selected-date'
                                        : null
                                    }
                                />
                            </div>

                            {/* Available Times Section */}
                            <div className="p-6 rounded-[20px] shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
                                <h3 className="text-lg font-semibold mb-4 text-[#293552]">Available Time Slots</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {availableTimes.map((time) => (
                                        <button
                                            key={time}
                                            type="button"
                                            onClick={() => handleTimeSelect(time)}
                                            className={`p-3 rounded-lg transition-all duration-200 ${
                                                formData.trialTime === time 
                                                ? 'bg-[#293552] text-white shadow-lg transform scale-105' 
                                                : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-8 ml-48 justify-center align-middle text-center w-full md:w-auto px-8 py-4 bg-[#293552] text-white font-semibold transition-all duration-300 transform hover:-translate-y-1 rounded hover:shadow-inner rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)]"
                        >
                            Submit
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default MultiStepForm;
