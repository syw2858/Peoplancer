import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
import '../../css/CalModal.css';
import ConfirmationModal from '../ConfirmationModal';
const CalModal = (props) => {
    const { open, close, event, render, setRender, userid } = props;
    const [edit, setEdit] = useState(false);
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [memo, setMemo] = useState('');
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [color, setColor] = useState('');



    useEffect(() => {
        if (event) {
            setId(event.id);
            setTitle(event.title);
            setStart(moment(event.start).format('YYYY-MM-DD'));
            setEnd(moment(event.end).format('YYYY-MM-DD'));
            setMemo(event.extendedProps.memo);
            setColor(event.color);
            setEdit(false);
        }
    }, [open, event]);

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

    const handleColorChange = (e) => {
        setColor(e.target.value);
    };

    const memochange = (e) => {
        setMemo(e.target.value);
        console.log(memo);
    }

    const handleEdit = () => {
        console.log({ event });
        setEdit(true);
    };

    const handlemodalSubmit = () => {
        setShowSubmitModal(true);
    }

    const confirmSubmit = () => {
        modalSubmit();
        setShowSubmitModal(false);
    }

    const modalSubmit = () => {
        const endDate = `${end}T23:59:59`;
        axios
            .patch(`http://localhost:8080/schedule/update`, {
                schedule_title: title,
                schedule_content: memo,
                schedule_start: start,
                schedule_end: endDate,
                schedule_key: parseInt(id),
                schedule_color: color
            })
            .then(() => {
                setEdit(false);
                setRender(!render);
                close();
            })
            .catch((e) => {
                console.error(e);
            });
    }

    const handlemodalDelete = () => {
        setShowDeleteModal(true);
    }

    const confirmDelete = () => {
        modalDelete();
        setShowDeleteModal(false);
    }

    const modalDelete = () => {
        axios
            .delete(`http://localhost:8080/schedule/delete/${id}`)
            .then(() => {
                setEdit(false);
                setRender(!render);
                close();
            })
            .catch((e) => {
                console.error(e)
            });
    };

    if (!event) return null;
    return (
        <div>
            <ConfirmationModal
                open={showSubmitModal}
                message="정말 수정하시겠습니까?"
                onConfirm={confirmSubmit}
                onCancel={() => setShowSubmitModal(false)}
            />

            <ConfirmationModal
                open={showDeleteModal}
                message="정말 삭제하시겠습니까?"
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteModal(false)}
            />
            {edit ? (
                <div className={open ? 'openModal modal-cal' : 'modal-cal'}>
                    {open ? (
                        <section>
                            <header>
                                <input className='calinput-gj' type='text' value={title} onChange={(e) => setTitle(e.target.value)} />
                                <button className='close-gj' onClick={close}>
                                    &times;
                                </button>
                            </header>
                            <main>
                                <p>
                                    시작 :&nbsp;&nbsp;
                                    <input
                                        type='date'
                                        id='start-time'
                                        value={start}
                                        onChange={(e) => setStart(e.target.value)}
                                        min='2023-01-01'
                                        max='2100-12-31'
                                    />
                                </p>
                                {end && moment(end).isValid ? (
                                    <p>
                                        끝 :&nbsp;&nbsp;&nbsp; &nbsp;
                                        <input
                                            type='date'
                                            id='end-time'
                                            value={end}
                                            onChange={(e) => setEnd(e.target.value)}
                                            min='2023-01-01'
                                            max='2100-12-31'
                                        />
                                    </p>
                                ) : null}
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <textarea className='cal-textarea' maxLength="100" placeholder='최대 150자까지 가능합니다' value={memo} onChange={memochange}></textarea>
                                <hr />
                                <label className='label-gj'>
                                    스케줄 컬러:
                                    <select className='cal-gj' value={color} onChange={handleColorChange}>
                                        <option value="">선택하세요</option>
                                        {colorList.map((item) => (
                                            <option key={item.value} value={item.value}>
                                                {item.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </main>
                            <footer>
                                <button onClick={handlemodalSubmit}>수정완료</button>
                                &nbsp;&nbsp;
                                <button onClick={handlemodalDelete}>삭제</button>
                            </footer>
                        </section>
                    ) : null}
                </div>
            ) : (
                <div className={open ? 'openModal modal-cal' : 'modal-cal'}>
                    {open ? (
                        <section>
                            <header>
                                {event.title}
                                <button className='close-gj' onClick={close}>
                                    &times;
                                </button>
                            </header>
                            <main>
                                <p>시작 : {moment(event.start).format('YYYY-MM-DD')}</p>
                                {event.end && moment(event.end).isValid ? (
                                    <p>끝 : {moment(event.end).format('YYYY-MM-DD')}</p>
                                ) : null}
                                <p>{event.extendedProps.memo}</p>
                                <hr />
                                <label className='label-gj'>
                                    스케줄 컬러:
                                    <h4 style={{ color: color }}>{color}</h4>
                                </label>
                            </main>
                            <footer>

                                <button onClick={handleEdit}>수정</button>
                                &nbsp;&nbsp;
                                <button onClick={handlemodalDelete}>삭제</button>
                            </footer>
                        </section>
                    ) : null}
                </div>
            )}
        </div>
    );
};

export default CalModal;