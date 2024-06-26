import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isToday, addMonths } from 'date-fns';
import { FaEllipsisH } from 'react-icons/fa';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import Slider from 'react-slick';


type Event = {
    date: Date;
    title: string;
    description: string
};

type CalendarComponentProps = {
    events: Event[];
};

export const CalendarComponent = ({ events }: CalendarComponentProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const renderHeader = () => {
        const dateFormat = "MMMM yyyy";

        return (
            <div className="flex justify-between items-center mb-4">
                <button className="" onClick={prevMonth}>
                    <ChevronLeftIcon className='w-10 h-10' />
                </button>
                <div className="text-lg font-bold">{format(currentMonth, dateFormat)}</div>
                <button className="" onClick={nextMonth}>
                    <ChevronRightIcon className='w-10 h-10' />
                </button>
            </div>
        );
    };

    const renderDays = () => {
        const dateFormat = "E";
        const days = [];
        const startDate = startOfWeek(currentMonth);

        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="text-xs font-medium text-center" key={i}>
                    {format(addDays(startDate, i), dateFormat)}
                </div>
            );
        }

        return <div className="grid grid-cols-7 gap-2 mb-2">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const dateFormat = "d";
        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, dateFormat);
                const cloneDay = day;

                const isInCurrentMonth = day >= monthStart && day <= monthEnd;

                days.push(
                    <div
                        className={`p-2 text-center rounded-full 
                          ${isToday(cloneDay) ? 'bg-blue-200 text-white' : ''} 
                          ${events.some((event: Event) => isSameDay(event.date, cloneDay)) ? 'bg-green-200' : ''} 
                          ${!isInCurrentMonth ? 'text-gray-300' : ''}
                        `}
                        key={cloneDay.getTime()}
                    >
                        <span>{formattedDate}</span>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-2 mb-2" key={day.getTime()}>
                    {days}
                </div>
            );
            days = [];
        }

        return <div>{rows}</div>;
    };


    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(addMonths(currentMonth, -1));
    };

    const renderCarousel = () => {
        const settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000
        };

        const backgroundColors = ["bg-pink-300", "bg-pink-800", "bg-green-800", "bg-blue-800", "bg-purple-800"];

        return (
            <Slider {...settings} className='my-4 bg-gray-50 rounded-lg shadow'>
                {events.map((event, index) => (
                    <div key={index} className={`p-4 rounded-lg ${backgroundColors[index % backgroundColors.length]}`}>
                        <div className="flex items-center">
                            <span className='w-4 h-4 bg-green-500 rounded-full mr-2'></span>
                            <p className="text-sm text-white">{format(event.date, 'MMMM d, yyyy')}</p>
                        </div>
                        <h3 className="text-2xl font-bold text-white">{event?.title}</h3>
                    </div>
                ))}
            </Slider>
        );
    };

    return (
        <div className="max-w-md mx-auto mt-5 bg-white p-5 rounded-lg shadow">
            <span className='flex justify-between'><p className='text-lg font-bold text-gray-900'>Events Calendar</p>
                <FaEllipsisH className="text-gray-500 hover:text-green-700 cursor-pointer" />
            </span>
            <div className='my-4'>
                {renderCarousel()}
            </div>
            <div className='bg-gray-50 rounded-lg p-4'>
                {renderHeader()}
                {renderDays()}
                {renderCells()}
            </div>

        </div>
    );
};
