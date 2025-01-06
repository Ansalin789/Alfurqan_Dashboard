'use client';

import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Image from 'next/image';
import { getCountries } from 'react-phone-number-input/input'
import en from 'react-phone-number-input/locale/en.json'
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface ApiResponse {
    success: boolean;
    message: string;
}

const MultiStepForm = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Basic Information States
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [referral, setReferral] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(0);
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [countryCode, setCountryCode] = useState("");

    // Learning Interest States
    const [learningInterest, setLearningInterest] = useState<string[]>([]);
    const [iqraUsageOther, setIqraUsageOther] = useState("");
    const [numberOfStudents, setNumberOfStudents] = useState("");
    const [preferredTeacher, setPreferredTeacher] = useState("");
    const [referralSource, setReferralSource] = useState("");
    const [referralSourceOther, setReferralSourceOther] = useState("");

    // Schedule States
    const [startDate, setStartDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [preferredFromTime, setPreferredFromTime] = useState("");
    const [preferredToTime, setPreferredToTime] = useState("");
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);






    const handlePhoneChange = (value: any, data: { countryCode: string }) => {
        // Log the value to understand what is being passed
        console.log('Phone input value:', value);
    
        // Remove non-numeric characters and convert to number
      const numericValue = value ;
    
        setPhoneNumber(numericValue);
        setCountryCode(data.countryCode || '');
    };

    const handleDateChange = (value: Value) => {
        if (value instanceof Date) {
            setStartDate(value);
            setToDate(value);  // Set toDate to the same as startDate
            loadAvailableTimes();
        }
    };

    const loadAvailableTimes = () => {
        const defaultTimes = [
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
            "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", 
            "01:00 PM", "01:30 PM", "02:00 PM"
        ];
        setAvailableTimes(defaultTimes);
        setPreferredFromTime("");
        
        // Automatically set preferredToTime when a from time is selected
        // const handleFromTimeSelection = (fromTime: string) => {
        //     const fromTimeIndex = defaultTimes.indexOf(fromTime);
        //     if (fromTimeIndex !== -1 && fromTimeIndex + 1 < defaultTimes.length) {
        //         setPreferredToTime(defaultTimes[fromTimeIndex + 1]);
        //     }
        // };
    };

    const validateStep1 = () => {
        if (!firstName.trim() || firstName.length < 3) {
            return { isValid: false, field: 'First Name (minimum 3 characters)' };
        }
        if (!lastName.trim() || lastName.length < 3) {
            return { isValid: false, field: 'Last Name (minimum 3 characters)' };
        }
        if (!email.trim()) {
            return { isValid: false, field: 'Email' };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, field: 'Email Format' };
        }
        
        if (!countryCode) {
            return { isValid: false, field: 'Country Code' };
        }
        if (!phoneNumber) {
            return { isValid: false, field: 'Phone Number' };
        }
        if (!country) {
            return { isValid: false, field: 'Country' };
        }

        return { isValid: true, field: null };
    };

    const validateStep2 = () => {
        if (learningInterest.length !== 1) return false;
        if (!numberOfStudents) return false;
        if (!preferredTeacher) return false;
        if (!referralSource) return false;
        return true;
    };

    const validateStep3 = () => {
        if (!startDate || !toDate) return false;
        if (!preferredFromTime || !preferredToTime) return false;
        return !!preferredFromTime;
    };

    const nextStep = () => {
        const validation = validateStep1();
        if (!validation.isValid) {
            alert(`Please fill in the ${validation.field} field correctly.`);
            return;
        }
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Validate required fields before submission
            if (!validateStep1().isValid || !validateStep2() || !validateStep3()) {
                alert('Please fill in all required fields');
                setIsLoading(false);
                return;
            }
            // Clean and format the phone number - remove any non-numeric characters
            // const cleanPhoneNumber = phoneNumber.toString().replace(/\D/g, '');

            const formattedData = {
                id: uuidv4(),
                firstName: firstName.trim().padEnd(3),
                lastName: lastName.trim().padEnd(3),
                email: email.trim().toLowerCase(),
                phoneNumber:  Number(phoneNumber),
                country: country.length >= 3 ? country : country.padEnd(3, ' '),
                countryCode: countryCode.toLowerCase(),
                city: city,
                learningInterest: learningInterest[0],
                numberOfStudents: Number(numberOfStudents),
                preferredTeacher: preferredTeacher,
                preferredFromTime: preferredFromTime,
                preferredToTime: preferredToTime,
                referralSource: referralSource,
                referralDetails: referralSourceOther || referral || '',
                startDate: startDate.toISOString(),
                endDate: toDate.toISOString(),
                evaluationStatus: 'PENDING',
                status: 'Active',
                createdBy: 'SYSTEM',
                lastUpdatedBy: 'SYSTEM',
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            };

            // Debug log to check the data being sent
            console.log('Sending data:', formattedData);
            const auth=localStorage.getItem('authToken');
            const response = await fetch('http://localhost:5001/student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${auth}`,
                },
                body: JSON.stringify(formattedData,null,2),
                mode: 'cors',
            });

            // Log the raw response
            console.log('Raw response:', response);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || `Server returned ${response.status}`);
            }

            const data: ApiResponse = await response.json();
            console.log('Success response:', data);

            // Reset form and redirect on success
            alert('Form submitted successfully!');
            router.push('/thank-you');

        } catch (error) {
            console.error('Submission error:', error);
            alert(`Failed to submit form: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const isTileDisabled = ({ date }: { date: Date }): boolean => {
        return date < new Date();
    };

    // Function to get country code based on selected country
    const getCountryCode = (country: string): string => {
        const countryCodes: { [key: string]: string } = {
            'us': '1',    // United States
            'ca': '1',    // Canada
            'gb': '44',   // United Kingdom
            'ae': '971',  // UAE
            'sa': '966',  // Saudi Arabia
            'qa': '974',  // Qatar
            'kw': '965',  // Kuwait
            'bh': '973',  // Bahrain
            'om': '968',  // Oman
            'pk': '92',   // Pakistan
            'in': '91',   // India
            'bd': '880',  // Bangladesh
            'my': '60',   // Malaysia
            'id': '62',   // Indonesia
            'au': '61',   // Australia
            'nz': '64',   // New Zealand
            'sg': '65',   // Singapore
            'de': '49',   // Germany
            'fr': '33',   // France
            'it': '39',   // Italy
            'es': '34',   // Spain
            'nl': '31',   // Netherlands
            'be': '32',   // Belgium
            'ch': '41',   // Switzerland
            'se': '46',   // Sweden
            'no': '47',   // Norway
            'dk': '45',   // Denmark
            'ie': '353',  // Ireland
            'za': '27',   // South Africa
            'eg': '20',   // Egypt
            'ma': '212',  // Morocco
            'ng': '234',  // Nigeria
            'ke': '254',  // Kenya
            'jp': '81',   // Japan
            'kr': '82',   // South Korea
            'cn': '86',   // China
            'br': '55',   // Brazil
            'mx': '52',   // Mexico
            'ar': '54',   // Argentina
        };
        return countryCodes[country.toLowerCase()] || '';
    };

    // Update the country handler
    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCountry = e.target.value;
        const selectedCountryCode = getCountryCode(selectedCountry);
        
        console.log('Country Change:', {
            country: selectedCountry,
            countryCode: selectedCountryCode
        });

        setCountry(selectedCountry);
        setCountryCode(selectedCountryCode);
    };

    const formatTime = (hours: number, minutes: number): string => {
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12; // Convert to 12-hour format
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes} ${period}`;
    };

    const calculatePreferredToTime = (fromTime: string) => {
        const timeParts = fromTime.split(':');
        if (timeParts.length !== 2) return '12:00 AM'; // Default to '12:00 AM' if format is incorrect

        const hours = parseInt(timeParts[0].trim(), 10);
        const minutes = parseInt(timeParts[1].trim(), 10);

        if (isNaN(hours) || isNaN(minutes)) return '12:00 AM'; // Default to '12:00 AM' if parsing fails

        const totalMinutes = hours * 60 + minutes + 30; // Add 30 minutes
        const newHours = Math.floor(totalMinutes / 60) % 24; // Ensure hours wrap around after 24
        const newMinutes = totalMinutes % 60;

        return formatTime(newHours, newMinutes); // Format the time correctly
    };


    return (
        <div className="max-w-[40%] mx-auto justify-center mt-10 p-6 rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)] bg-gradient-to-r from-[#e3e8f4] via-[#94b3fa52] to-[#e3e8f4]">
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
                        </div>
                        <div className="flex gap-6 mb-6">
                            <div>
                            <label htmlFor="First Name" className='text-[14px]'>First Name</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                minLength={3}
                                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100`}
                            />
                            </div>
                            
                            
                            <div>
                            <label htmlFor="Last Name" className='text-[14px]'>Last Name</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                minLength={3}
                                className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100`}
                            />
                            </div>
                        </div>
                        <div className="flex gap-6 mb-6">
                            <div>
                                <label htmlFor="Email" className='text-[14px]'>Email</label><br />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100"
                                />
                            </div>

                            <div>
                                <label htmlFor="First Name" className='text-[14px]'>city</label>
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                    minLength={3}
                                    className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100`}
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-6 mb-6">
                            
                            <div className="w-1/2">
                                <label htmlFor="Phone Number" className='text-[14px]'>Phone Number</label>
                                <PhoneInput
                                    country={countryCode.toLowerCase()}
                                    value={phoneNumber ? String(phoneNumber) : ""}
                                    onChange={handlePhoneChange}
                                    inputClass="w-full p-3 py-6 rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100"
                                    containerClass="w-full"
                                    buttonStyle={{ backgroundColor: 'rgb(243 244 246)', borderColor: '#e5e7eb' }}
                                    inputStyle={{ backgroundColor: 'rgb(243 244 246)', width: '100%', borderColor: '#e5e7eb' }}
                                    placeholder="Phone Number"
                                />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="Country" className='text-[14px]'>Country</label>
                                <select
                                    className="w-full p-3 text-[13px] border rounded appearance-none focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100"
                                    value={country}
                                    onChange={handleCountryChange}
                                >
                                    <option value="" className='text-[12px]'>Please Select Your Country</option>
                                    {getCountries().map((country) => (
                                        <option key={country} value={country}>
                                            {en[country]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                        </div>
                            
                            <div>
                                <label htmlFor="Referral Code" className='text-[14px]'>Referral Code</label><br />
                                <input
                                type="text"
                                placeholder="Referral Code"
                                value={referral}
                                onChange={(e) => setReferral(e.target.value)}
                                className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100 w-1/2"
                            />
                            </div>
                        <button
                            type="button"
                            onClick={nextStep}
                            className="justify-end mt-10 ml-[240px] text-[20px] p-10 align-middle py-4 bg-[#293552] text-white font-semibold hover:shadow-inner rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)]"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <button
                            type="button"
                            onClick={prevStep}
                            aria-label="Go back to previous step"
                            className="text-gray-500 mb-4"
                        >
                            ←Back
                        </button>
                        <h2 className="text-lg text-center font-bold mb-4 text-[#293552]">
                            What will you use AL Furquan for?
                        </h2>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {['Quran', 'Islamic Studies', 'Arabic'].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setLearningInterest([option])}
                                    className={`p-4 hover:transition-all duration-500 ease-in-out rounded hover:shadow-inner rounded-br-[10px] rounded-tl-[10px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.1)] ${
                                        learningInterest[0] === option ? 'bg-[#3c85fa2e]' : 'bg-gray-100'
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        
                        {learningInterest.includes('Other') && (
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Please specify your course"
                                    value={iqraUsageOther}
                                    onChange={(e) => setIqraUsageOther(e.target.value)}
                                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100"
                                />
                            </div>
                        )}

                        <h2 className="text-lg text-center font-bold mb-4 text-[#293552]">
                            How many students will join?
                        </h2>
                        <div className="grid grid-cols-5 gap-4 mb-6 rounded-br-[30px] rounded-tl-[30px] rounded-bl-[25px] rounded-tr-[25px]">
                            {[1, 2, 3, 4, 5].map((count) => (
                                <button
                                    key={count}
                                    type="button"
                                    onClick={() => setNumberOfStudents(count.toString())}
                                    className={`p-4 hover:transition-all duration-500 ease-in-out  hover:shadow-inner rounded-full shadow-[8px_8px_50px_0px_rgba(0,0,0,0.2)] ${
                                        numberOfStudents === count.toString() ? 'bg-[#3c85fa2e]' : 'bg-gray-100'
                                    }`}
                                >
                                    {count}
                                </button>
                            ))}
                        </div>

                        <h2 className="text-lg text-center font-bold mb-4 text-[#293552]">
                            Which teacher would you like?
                        </h2>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {['Male', 'Female', 'Either'].map((preference) => (
                                <button
                                    key={preference}
                                    type="button"
                                    onClick={() => setPreferredTeacher(preference)}
                                    className={`p-4 hover:transition-all duration-500 ease-in-out rounded hover:shadow-inner rounded-br-[10px] rounded-tl-[10px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.2)] ${
                                        preferredTeacher === preference ? 'bg-[#3c85fa2e]' : 'bg-gray-100'
                                    }`}
                                >
                                    {preference}
                                </button>
                            ))}
                        </div>

                        <div className='mt-6'>
                            <h2 className="text-lg text-center font-bold mb-4 text-[#293552]">
                                Where did you hear about AL Furquan?
                            </h2>
                            <div className="grid grid-cols-5 gap-4 mb-6">
                                {['Friend', 'Social Media', 'E-Mail', 'Google', 'Other'].map((source) => (
                                    <button
                                        key={source}
                                        type="button"
                                        onClick={() => setReferralSource(source)}
                                        className={`p-4 hover:transition-all duration-500 ease-in-out rounded hover:shadow-inner rounded-br-[10px] rounded-tl-[10px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.2)] ${
                                            referralSource === source ? 'bg-[#3c85fa2e]' : 'bg-gray-100'
                                        }`}
                                    >
                                        {source}
                                    </button>
                                ))}
                            </div>
                            
                            {referralSource === 'Other' && (
                                <div className="mb-6">
                                    <input
                                        type="text"
                                        placeholder="Please specify where you heard about us"
                                        value={referralSourceOther}
                                        onChange={(e) => setReferralSourceOther(e.target.value)}
                                        className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#293552] bg-gray-100"
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={nextStep}
                            className="justify-center mt-10 text-center ml-[240px] text-[20px] p-8 align-middle py-4 bg-[#293552] text-white font-semibold transition-all rounded hover:shadow-inner rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)]"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className='p-6 rounded-3xl'>
                        <button 
                            type="button" 
                            onClick={prevStep} 
                            className="text-gray-500 mb-4 hover:text-gray-700 transition-colors"
                        >
                             Back
                        </button>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-[#293552]">Select a Date and Time</h2>
                            <p className="text-gray-600 mt-2">Choose your preferred schedule</p>
                        </div>

                        <div className="flex md:flex-cols-1 gap-8">
                            {/* Calendar Section */}
                            <div className="p-2 rounded-[20px] shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
                                <style dangerouslySetInnerHTML={{ __html: `
                                    /* Base calendar styles */
                                    .react-calendar {
                                        width: 100% !important;
                                        background-color: rgb(229 231 235) !important;
                                        border: none !important;
                                        border-radius: 20px !important;
                                    }
                                    
                                    /* Sunday dates only */
                                    .react-calendar__month-view__days__day--weekend:nth-child(7n + 1) {
                                        color: #ef4444 !important;
                                    }
                                    
                                    /* Selected date (including Sundays) */
                                    .react-calendar__tile--active,
                                    .selected-date {
                                        background-color: #293552 !important;
                                        color: white !important;
                                    }
                                    
                                    /* Selected Sunday */
                                    .react-calendar__tile--active.react-calendar__month-view__days__day--weekend:nth-child(7n + 1),
                                    .selected-date.react-calendar__month-view__days__day--weekend:nth-child(7n + 1) {
                                        color: white !important;
                                    }
                                `}} />
                                <Calendar
                                    onChange={handleDateChange}
                                    value={startDate}
                                    tileDisabled={isTileDisabled}
                                    className="mx-auto custom-calendar"
                                    selectRange={false}
                                    minDate={new Date()}
                                    tileClassName={({ date, view }) => 
                                        view === 'month' && 
                                        date.toDateString() === startDate.toDateString()
                                            ? 'selected-date'
                                            : null
                                    }
                                />
                            </div>
                            {/* Available Times Section */}
                            <div className="p-2 rounded-[20px] shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
                                <h3 className="text-[15px] text-center align-middle font-semibold mb-4 text-[#293552] p-2">
                                    Available Time Slots
                                </h3>
                                <div className="grid grid-cols-1 text-center gap-4 mb-4">
                                    <div>
                                        {/* <p className="text-sm font-medium mb-2">From</p> */}
                                        <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#293552] scrollbar-track-gray-100">
                                            <div className="grid grid-cols-1 gap-3 text-[10px]">
                                                {availableTimes.map((time) => (
                                                <button
                                                    key={time}
                                                    type="button"
                                                    value={preferredFromTime}
                                                    onClick={() => {
                                                        const fromTime = time;

                                                        // Check if fromTime is a valid string
                                                        if (typeof fromTime === 'string' && fromTime.includes(':')) {
                                                            setPreferredFromTime(fromTime);
                                                            const toTime = calculatePreferredToTime(fromTime);
                                                            setPreferredToTime(toTime);
                                                        } else {
                                                            console.error('Invalid fromTime format:', fromTime);
                                                            // Optionally, handle the error (e.g., show a message to the user)
                                                        }
                                                      }}
                                                    className={`p-1 rounded-lg transition-all duration-200 ${
                                                    preferredFromTime === time 
                                                        ? 'bg-[#293552] text-white shadow-lg transform scale-100 p-4 text-[10px]' 
                                                        : 'bg-gray-200 hover:bg-gray-100 p-4'
                                                    }`}
                                                >
                                                    {time}
                                                </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className=''>
                                        <p className="text-sm font-medium mb-2">To</p>
                                        <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
                                            <div className="grid grid-cols-1 gap-3 text-[10px]">
                                                {availableTimes.map((time) => (
                                                    <button
                                                        key={time}
                                                        type="button"
                                                        onClick={() => setPreferredToTime(time)}
                                                        className={`p-3 rounded-lg transition-all duration-200 ${
                                                            preferredToTime === time 
                                                            ? 'bg-[#293552] text-white shadow-lg transform scale-100' 
                                                            : 'bg-gray-200 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`mt-8 ml-48 justify-center align-middle text-center w-full md:w-auto px-8 py-4 bg-[#293552] text-white font-semibold transition-all duration-300 transform hover:-translate-y-1 rounded hover:shadow-inner rounded-br-[20px] rounded-tl-[20px] rounded-bl-[10px] rounded-tr-[10px] shadow-[8px_8px_50px_0px_rgba(0,0,0,0.4)] ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </div>
                            ) : (
                                'Submit'
                            )}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default MultiStepForm;
