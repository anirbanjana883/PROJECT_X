import React from 'react';
import { FaUserMd, FaNotesMedical, FaPhone, FaCalendarAlt, FaVenusMars, FaBirthdayCake } from 'react-icons/fa';

const PatientDetailsCard = ({ patient }) => {
  return (
    <div className="glass-card p-6 h-full">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
        <FaUserMd className="text-cyan-500" /> Medical Record (A-Z)
      </h3>

      <div className="space-y-6">
        
        {/* Bio Section */}
        <div className="grid grid-cols-2 gap-4">
            <DetailItem icon={<FaVenusMars />} label="Gender" value={patient?.gender || "Male"} />
            <DetailItem icon={<FaBirthdayCake />} label="Age" value={patient?.age ? `${patient.age} Yrs` : "8 Yrs"} />
            <DetailItem icon={<FaPhone />} label="Parent Contact" value={patient?.parentPhone || "+1 (555) 000-0000"} />
            <DetailItem icon={<FaCalendarAlt />} label="Joined" value="Oct 2023" />
        </div>

        {/* Clinical Section */}
        <div className="bg-gray-50 dark:bg-[#111] p-4 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Primary Diagnosis</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                {patient?.condition || "Amblyopia (Left Eye)"}
            </p>
        </div>

        {/* Notes */}
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <FaNotesMedical /> Clinical Notes
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed bg-white dark:bg-[#050505] p-3 rounded-lg border border-gray-200 dark:border-gray-800 h-24 overflow-y-auto custom-scrollbar">
                {patient?.notes || "Patient showing steady improvement in saccadic movements. Recommended to increase contrast sensitivity training in next session. Parent reports better focus at school."}
            </div>
        </div>

      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="text-gray-400 mt-0.5 text-xs">{icon}</div>
        <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-200">{value}</p>
        </div>
    </div>
);

export default PatientDetailsCard;