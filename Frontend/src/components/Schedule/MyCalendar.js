import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../../css/MyCalendar.css';
import CalModal from './CalModal';
import MySidebar from '../my/mySidebar/MySidebar';
import axios from "axios";
import ConfirmationModal from '../ConfirmationModal';


const MyCalendar = () => {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [color, setColor] = useState('');
    const [content, setContent] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isStartDateSelected, setIsStartDateSelected] = useState(false);
    const [events, setEvents] = useState([]);
    const [render, setRender] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);



    const closeModal = () => {
        setModalOpen(false);
    };

    const colorList = [
        { label: 'Red', value: 'red' },
        { label: 'Blue', value: 'blue' },
        { label: 'Green', value: 'green' },
        { label: 'Yellow', value: 'yellow' },
        { label: 'Orange', value: 'orange' },
        { label: 'Purple', value: 'purple' },
        { label: 'Pink', value: 'pink' },
        { label: 'Brown', value: 'brown' },
        { label: 'Gray', value: 'gray' },
    ];



    const handleDateClick = (arg) => {
        if (!isStartDateSelected) {
            setStart(arg.dateStr);
            setIsStartDateSelected(true);
            alert('시작 날짜가 저장되었습니다.');
        } else {
            const selectedEndDate = `${arg.dateStr}T00:01`;
            if (selectedEndDate <= start) {
                alert('종료 날짜가 시작 날짜보다 이전입니다.');
            } else {
                setEnd(arg.dateStr);
                setIsStartDateSelected(false);
                alert('종료 날짜가 저장되었습니다.');
            }
        }
    };


    const handleReset = (event) => {
        event.preventDefault();
        setContent('');
        setTitle('');
        setStart('');
        setEnd('');
        setColor('');
        setIsStartDateSelected(false);
    }


    const handleEventClick = (clickInfo) => {
        const clickedEventId = clickInfo.event.id;
        const clickedEvent = events.find((event) => event.id.toString() === clickedEventId);
        setSelectedEvent(clickedEvent);
        setModalOpen(true);
    };



    const handleColorChange = (e) => {
        setColor(e.target.value);
    };

    //axios 시작
    const userid = window.sessionStorage.getItem('user_id');
    const getEvent = () => {
        axios
            .get(`http://localhost:8080/schedule/get?user_id=${userid}`, {})
            .then((res) => {
                const { data } = res;
                const events = data.map((event) => {
                    const { schedule_key, schedule_title, schedule_content, schedule_start, schedule_end, schedule_color } = event;
                    const eventObject = {
                        id: schedule_key,
                        title: schedule_title,
                        color: schedule_color,
                        extendedProps: {
                            memo: schedule_content,
                        },
                    };
                    if (schedule_end === null) {
                        eventObject.date = schedule_start;
                    } else {
                        eventObject.start = schedule_start;
                        eventObject.end = schedule_end;
                    }
                    return eventObject;
                });
                setEvents(events);
            })
            .catch((e) => {
                console.error(e);
            });
    };

    useEffect(() => {
        getEvent();
    }, [render]);


    const handleSubmit = (event) => {
        event.preventDefault();
        setShowAddModal(true);
    }

    const confirmAdd = (event) => {
        event.preventDefault();

        // 유효성 검사
        if (!title || !start || !color || !content) {
            alert('필수 입력 필드를 입력하세요.');
            return;
        }
        if (end != null && end < start) {
            alert('종료 날짜가 시작 날짜보다 이전입니다.');
            return;
        }
        const endDate = `${end}T23:59:59`;
        console.log(endDate);
        axios
            .post(`http://localhost:8080/schedule/insert`, {
                // user_id: 'admin',
                user_id: userid,
                schedule_title: title,
                schedule_content: content,
                schedule_start: start,
                schedule_end: endDate,
                schedule_color: color,
            })
            .then(() => {
                setRender(!render);
                setShowAddModal(false);
            })
            .catch((e) => {
                console.error(e);
            })


        setContent('');
        setTitle('');
        setStart('');
        setEnd('');
        setColor('');
    };




    return (
        <div className='flex'>
            <MySidebar />
            <div className="calendar-wrapper">
                <div className="calendar-container">
                    <FullCalendar
                        locale='ko'
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        events={events}
                        displayEventTime={false}
                    />
                </div>
                <div className="form-wrapper-gj">
                    <form>
                        <label className='label-gj'>
                            제목:
                            <input className='calinput-gj' type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </label>
                        <hr />
                        <label className='label-gj'>
                            시작 시간:
                            <input type="date"
                                id="start-time" value={start}
                                onChange={(e) => setStart(e.target.value)}
                                min="2023-01-01"
                                max="2100-12-31"
                            />
                        </label>
                        <br />
                        <label className='label-gj'>
                            종료 시간:
                            <input
                                type="date"
                                id="end-time" value={end}
                                onChange={(e) => setEnd(e.target.value)}
                                min="2023-01-01"
                                max="2100-12-31" />
                        </label>
                        <button className='cal-button-gj' onClick={handleReset} >
                            리셋
                        </button>
                        <hr />
                        <label className='label-gj'>
                            내용:
                            <textarea className='cal-textarea' maxLength="100" placeholder='최대 150자까지 가능합니다' value={content} onChange={(e) => setContent(e.target.value)}></textarea>


                        </label>
                        <hr />
                        <label className='label-gj'>
                            컬러 :
                            <select className='cal-gj' value={color} onChange={handleColorChange}>
                                <option value="">선택하세요</option>
                                {colorList.map((item) => (
                                    <option key={item.value} value={item.value}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <button className='cal-button-gj' onClick={handleSubmit} >추가</button>
                    </form>
                </div>
                <CalModal open={modalOpen} close={closeModal} event={selectedEvent} render={render} setRender={setRender} userid={userid} />
                <ConfirmationModal
                    open={showAddModal}
                    message="스케줄을 추가할까요?"
                    onConfirm={confirmAdd}
                    onCancel={() => setShowAddModal(false)}
                />
            </div>
        </div>
    );
}

export default MyCalendar;