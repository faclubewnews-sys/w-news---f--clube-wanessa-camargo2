import React, { useState, useMemo } from 'react';
import { User } from '../data/mockData';

interface BirthdayCalendarProps {
    users: User[];
}

export const BirthdayCalendar: React.FC<BirthdayCalendarProps> = ({ users }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const birthdaysByDay = useMemo(() => {
        const map = new Map<number, User[]>();
        const currentMonth = currentDate.getMonth();

        users.forEach(user => {
            const dob = new Date(user.dob.split('/').reverse().join('-'));
            if (dob.getMonth() === currentMonth) {
                const day = dob.getDate();
                if (!map.has(day)) {
                    map.set(day, []);
                }
                map.get(day)?.push(user);
            }
        });
        return map;
    }, [users, currentDate]);

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    const blanks = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const selectedDayBirthdays = selectedDay ? birthdaysByDay.get(selectedDay) : [];

    const changeMonth = (offset: number) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
        setSelectedDay(null);
    }

    return (
        <div className="bg-brand-bg-light/50 dark:bg-dark-bg-secondary rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-brand-text dark:text-dark-accent mb-4">Aniversariantes do Mês</h3>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-brand-gold/20 dark:hover:bg-dark-icon/50">&lt;</button>
                <span className="font-semibold text-center w-28">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-brand-gold/20 dark:hover:bg-dark-icon/50">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-brand-text/60 dark:text-dark-text-soft/60">
                <div>D</div><div>S</div><div>T</div><div>Q</div><div>Q</div><div>S</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1 mt-2">
                {blanks.map((_, i) => <div key={`blank-${i}`}></div>)}
                {days.map(day => {
                    const hasBirthday = birthdaysByDay.has(day);
                    const isSelected = selectedDay === day;
                    return (
                        <div key={day} className="relative">
                            <button
                                onClick={() => setSelectedDay(day)}
                                className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center font-semibold mx-auto ${
                                    isSelected ? 'bg-brand-text text-brand-bg-light dark:bg-dark-accent dark:text-dark-bg-main' : 'hover:bg-brand-gold/20 dark:hover:bg-dark-icon/50'
                                }`}
                            >
                                {day}
                            </button>
                             {hasBirthday && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brand-accent dark:bg-dark-accent rounded-full"></div>}
                        </div>
                    )
                })}
            </div>
            {selectedDay && selectedDayBirthdays && selectedDayBirthdays.length > 0 && (
                 <div className="mt-4 pt-4 border-t border-brand-gold/20 dark:border-dark-icon/50">
                    <h4 className="font-semibold text-brand-text dark:text-dark-text-soft mb-2">Aniversariantes de {selectedDay} de {currentDate.toLocaleString('default', { month: 'long' })}</h4>
                     <ul className="space-y-2">
                        {selectedDayBirthdays.map(user => (
                            <li key={user.id} className="flex items-center gap-2 text-sm">
                                <img src={user.profilePic} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                                <span>{user.name}</span>
                            </li>
                        ))}
                    </ul>
                 </div>
            )}
        </div>
    );
};
