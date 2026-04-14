import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { User } from '../services/api';

interface Course {
  id: number;
  title: string;
  instructor: string;
  time: string;
  day: string;
  location: string;
  spots: number;
  maxSpots: number;
}

export default function Booking({ user }: { user: User }) {
  const [selectedDay, setSelectedDay] = useState('Donnerstag');
  const [bookedCourses, setBookedCourses] = useState<number[]>([]);

  const courses: Course[] = [
    {
      id: 1,
      title: 'Vinyasa Flow - Fokus Hüfte',
      instructor: 'Sarah Meyer',
      time: '08:00 - 09:30',
      day: 'Montag',
      location: 'Studio A',
      spots: 12,
      maxSpots: 15
    },
    {
      id: 2,
      title: 'Anatomie in der Praxis',
      instructor: 'Dr. Klaus Weber',
      time: '10:00 - 12:00',
      day: 'Donnerstag',
      location: 'Seminarraum 1',
      spots: 8,
      maxSpots: 10
    },
    {
      id: 3,
      title: 'Körperarbeit & Adjustments',
      instructor: 'Evolated Expert',
      time: '14:00 - 16:00',
      day: 'Donnerstag',
      location: 'Studio B',
      spots: 5,
      maxSpots: 12
    },
    {
      id: 4,
      title: 'Restorative Yoga',
      instructor: 'Lena Schmidt',
      time: '18:00 - 19:30',
      day: 'Freitag',
      location: 'Studio A',
      spots: 14,
      maxSpots: 15
    }
  ];

  const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const filteredCourses = courses.filter(c => c.day === selectedDay);

  const handleBooking = (id: number) => {
    if (bookedCourses.includes(id)) {
      setBookedCourses(bookedCourses.filter(courseId => courseId !== id));
    } else {
      setBookedCourses([...bookedCourses, id]);
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-serif text-4xl text-zinc-900 mb-2">Vor-Ort Termine</h1>
        <p className="text-zinc-500">Buche deine wöchentlichen Präsenz-Kurse und Workshops.</p>
      </header>

      {/* Calendar Header */}
      <div className="card-evolated p-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <CalendarIcon size={20} />
            </div>
            <h2 className="font-serif text-2xl text-zinc-900">Wochenplan</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
            <span className="text-sm font-bold text-zinc-900">März 2024</span>
            <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"><ChevronRight size={20} /></button>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`py-4 rounded-2xl text-sm font-bold transition-all ${
                selectedDay === day 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'
              }`}
            >
              {day.substring(0, 2)}
              <div className="text-[10px] mt-1 opacity-60">{day}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-6">
        <h3 className="font-serif text-xl text-zinc-900 px-2">Verfügbare Kurse am {selectedDay}</h3>
        
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map(course => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-evolated p-8 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                      {course.location}
                    </span>
                    <div className="flex items-center gap-1 text-zinc-400 text-xs">
                      <Clock size={14} /> {course.time}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-serif text-2xl text-zinc-900 mb-1">{course.title}</h4>
                    <p className="text-zinc-500 text-sm">Leitung: {course.instructor}</p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <MapPin size={14} /> Evolated Center
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      {course.maxSpots - course.spots} Plätze frei
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleBooking(course.id)}
                  className={`mt-8 w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                    bookedCourses.includes(course.id)
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800'
                  }`}
                >
                  {bookedCourses.includes(course.id) ? (
                    <>Gebucht <CheckCircle2 size={18} /></>
                  ) : (
                    'Platz reservieren'
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card-evolated p-12 text-center text-zinc-400">
            <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-serif text-xl">Keine Kurse für diesen Tag gefunden.</p>
            <p className="text-sm mt-2">Wähle einen anderen Tag im Kalender aus.</p>
          </div>
        )}
      </div>

      {/* Subscription Info */}
      <div className="bg-zinc-900 text-white p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4">
          <h3 className="font-serif text-3xl">Dein Kontingent</h3>
          <p className="text-white/60 leading-relaxed">
            In deinem Abo (89 €/Monat) ist 1 Vor-Ort-Termin pro Woche enthalten. Du hast für diese Woche noch 1 Termin verfügbar.
          </p>
        </div>
        <div className="w-full md:w-auto">
          <button className="w-full md:w-auto px-10 py-5 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
            Upgrade auf Unlimited
          </button>
        </div>
      </div>
    </div>
  );
}
