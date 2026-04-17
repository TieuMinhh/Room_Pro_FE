import React, { useEffect, useState, useMemo } from 'react';
import { Clock4 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTimeExpried } from '@/apis/userAPIs';

export const AccountExpireInfo = () => {
  const navigate = useNavigate();
  const [timeExpired, setTimeExpired] = useState<string | null>(null);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const res = await getTimeExpried();
        setTimeExpired(res?.data); 
      } catch (error) {
        console.error('Failed to fetch expiration time:', error);
      }
    };

    fetchTime();
  }, []);

  const daysLeft = useMemo(() => {
    if (!timeExpired) return null;
    const now = new Date();
    const expired = new Date(timeExpired);
    const diff = Math.ceil((expired.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [timeExpired]);

  const isExpiringSoon = daysLeft !== null && daysLeft <= 15;

  return (
    <div
      className="text-sm cursor-pointer italic"
      onClick={() => navigate('/packages')}
    >
      <div className="flex items-center gap-2">
        <Clock4 className="w-4 h-4 text-primary" />
        <span className={isExpiringSoon ? 'text-red-500' : 'text-blue-600'}>
          Tài khoản của bạn còn {daysLeft ?? '...'} ngày
        </span>
      </div>
    </div>
  );
};
