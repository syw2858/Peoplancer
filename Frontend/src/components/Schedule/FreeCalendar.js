import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from "axios";
import '../../css/schedulemodal.css'


const FreeCalendar = (props) => {
    const { open, close, userid } = props;
    const [events, setEvents] = useState([]);


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
        console.log(events);
    }, [events]);

    return (
        <div className={`modal-schedule ${open ? "openModal" : ""}`}>
            <section>
                <main>
                    <button className="close-gj" onClick={close}>
                        &times;
                    </button>
                    <h2 style={{ textAlign: "center" }}>{userid}님의 스케줄</h2>
                    <FullCalendar
                        locale="ko"
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        displayEventTime={false}
                    />

                </main>
            </section>
        </div>
    );

}
export default FreeCalendar;