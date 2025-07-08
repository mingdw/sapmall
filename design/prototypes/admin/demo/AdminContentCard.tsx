import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

interface CustomCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    reqKey?: string;
}

const AdminContentCard: React.FC<CustomCardProps> = ({ title, icon, children,reqKey }) => {
    return (
        <div style={{ marginBottom: '16px',backgroundColor:'#fff',border:'1px solid #E1DBDB',borderRadius:'5px'}}>
            <div style={{height:'40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' ,backgroundColor:'#EEF2F4',borderRadius:'5px 0 0 5px'}}>
                <div style={{ display: 'flex', alignItems: 'center',marginLeft:'20px' }}>
                    {icon}
                    <span style={{ marginLeft: '8px' }}>{title}</span>
                </div>
                {reqKey && <Link to={"/about?key="+reqKey} style={{ color: '#1890ff' ,marginRight:'20px',fontSize:'12px'}}>
                    <QuestionCircleOutlined /> 常见问题
                </Link>}
            </div>
            <div style={{ marginTop: '16px',textAlign:'center' ,display: 'flex', justifyContent: 'center',}}>
                <div style={{width:'95%',textAlign:'left'}}>
                    {children}
                </div>
                
            </div>
        </div>
    );
};

export default AdminContentCard;