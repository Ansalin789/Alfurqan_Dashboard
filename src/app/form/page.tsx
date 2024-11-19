'use client';

import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import countries from '@/components/form/countries';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Image from 'next/image';

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
    trialDate: Date;
    trialTime: string;
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
        trialDate: new Date(),
        trialTime: '',
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

    const handleDateChange = (value: Date | null) => {
        if (value) {
            setFormData({
                ...formData,
                trialDate: value,
            });
            loadAvailableTimes(value);
        }
    };

    const loadAvailableTimes = (date: Date) => {
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

    return (
        <div className="max-w-[40%] mx-auto mt-10 p-6 bg-white shadow-lg rounded-br-[50px] rounded-tl-[50px] rounded-bl-[8px] rounded-tr-[8px]">
            <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium">Contact</div>
                <div className="text-sm font-medium">{step * 33}%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${step * 33}%` }}></div>
            </div>
            <div className="flex items-center justify-center mb-4 p-6">
                <Image src="/assets/images/alf2.png" alt="Logo" width={160} height={160} className="mr-10" />
                <div>
                    <h2 className="text-2xl font-bold">أهلا ومرحبا</h2>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {step === 1 && (
                    <div>
                        <label className="block mb-2 font-semibold">First / Last name</label>
                        <div className="flex gap-4 mb-4">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-4 mb-4">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex gap-4 mb-4">
                            <PhoneInput
                                country={'us'}
                                value={formData.number}
                                onChange={handlePhoneChange}
                                inputClass="w-full p-3 py-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                containerClass="w-full"
                            />
                        </div>
                        <div className="relative mb-4">
                            <select
                                className="w-full p-3 border rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                            >
                                <option value="">Please Select Your Country</option>
                                {countries.map((country) => (
                                    <option key={country.code} value={country.name}>{country.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={nextStep}
                            className="justify-end ml-[240px] text-[20px] p-10 align-middle py-4 bg-[#293552] text-white font-semibold rounded-br-[30px] rounded-tl-[30px] rounded-bl-[8px] rounded-tr-[8px] hover:shadow-inner shadow-2xl transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <button type="button" onClick={prevStep} className="text-gray-500 mb-4">Back</button>
                        <h2 className="text-lg font-bold mb-4 text-[#293552]">What will you use IQRA for?</h2>
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            {['Quran', 'Islamic Studies', 'Arabic', 'Other'].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleMultiSelectOptionChange('iqraUsage', option)}
                                    className={`p-4 rounded hover:shadow-inner shadow-lg ${
                                        formData.iqraUsage.includes(option) ? 'bg-[#3c85fa2e]' : 'bg-gray-100'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <h2 className="text-lg font-bold mb-4 text-[#293552]">How many students will join?</h2>
                        <div className="grid grid-cols-5 gap-4 mb-6">
                            {[1, 2, 3, 4, 5].map((count) => (
                                <button
                                    key={count}
                                    type="button"
                                    onClick={() => handleSingleSelectOptionChange('studentsCount', count)}
                                    className={`p-4 rounded hover:shadow-inner shadow-lg ${
                                        Number(formData.studentsCount) === count ? 'bg-[#3c85fa2e]' : 'bg-gray-100'
                                    }`}
                                >
                                    {count}
                                </button>
                            ))}
                        </div>

                        <h2 className="text-lg font-bold mb-4 text-[#293552]">For your evaluation, do you prefer</h2>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {['Male Teacher', 'Female Teacher', 'Either'].map((preference) => (
                                <button
                                    key={preference}
                                    type="button"
                                    onClick={() => handleSingleSelectOptionChange('teacherPreference', preference)}
                                    className={`p-4 rounded hover:shadow-inner shadow-lg ${
                                        formData.teacherPreference === preference ? 'bg-[#3c85fa2e]' : 'bg-gray-100'
                                    }`}
                                >
                                    {preference}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={nextStep}
                            className="justify-end ml-[240px] text-[20px] p-10 align-middle py-4 bg-[#293552] text-white font-semibold rounded-br-[30px] rounded-tl-[30px] rounded-bl-[8px] rounded-tr-[8px] hover:shadow-inner shadow-2xl transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <button type="button" onClick={prevStep} className="text-gray-500 mb-4">Back</button>
                        <h2 className="text-lg font-bold mb-4 text-[#293552]">Select Trial Date</h2>
                        <Calendar
                            onChange={handleDateChange}
                            value={formData.trialDate}
                            tileDisabled={isTileDisabled}
                        />
                        <h2 className="text-lg font-bold mt-6 mb-4 text-[#293552]">Available Times</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {availableTimes.map((time) => (
                                <button
                                    key={time}
                                    type="button"
                                    onClick={() => handleTimeSelect(time)}
                                    className={`p-4 rounded hover:shadow-inner shadow-lg ${
                                        formData.trialTime === time ? 'bg-[#3c85fa2e]' : 'bg-gray-100'
                                    }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                        <button
                            type="submit"
                            className="justify-end ml-[240px] text-[20px] p-10 align-middle py-4 bg-[#293552] text-white font-semibold rounded-br-[30px] rounded-tl-[30px] rounded-bl-[8px] rounded-tr-[8px] hover:shadow-inner shadow-2xl transition-all"
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
