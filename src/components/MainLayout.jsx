import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';

const MainLayout = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-white">
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-gray-50 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
        </div>
    );

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="flex bg-gray-50/30 min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto max-h-screen p-8 lg:p-12 custom-scrollbar">
                <div className="max-w-7xl mx-auto animate-fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
