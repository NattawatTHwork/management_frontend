import {
    Box,
    chakra,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    Divider,
    Heading,
} from '@chakra-ui/react'
import Layout from '../../components/common/Layout'
import { checkLoginSuperAdmin } from '../../components/auth/checkLoginSuperAdmin'
import { useEffect, useState } from 'react'

interface StatsCardProps {
    title: string
    stat: string
}
function StatsCard(props: StatsCardProps) {
    const { title, stat } = props
    return (
        <Stat
            px={{ base: 4, md: 8 }}
            py={'5'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            rounded={'lg'}>
            <StatLabel fontWeight={'medium'} isTruncated>
                {title}
            </StatLabel>
            <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                {stat}
            </StatNumber>
        </Stat>
    )
}

interface superadmin {
    total: number;
    status_1_count: number;
    status_0_count: number;
}

interface admin {
    total: number;
    status_1_count: number;
    status_0_count: number;
}

interface user {
    total: number;
    status_1_count: number;
    status_0_count: number;
}

interface today_status {
    total_users: number;
    leave_requests_count: number;
    timeclock_count: number;
}

export default function SuperAdminDashboard() {
    const [superadmin, setSuperAdmin] = useState<superadmin>();
    const [admin, setAdmin] = useState<admin>();
    const [user, setUser] = useState<user>();
    const [today_status, setTodayStatus] = useState<today_status>();

    useEffect(() => {
        checkLoginSuperAdmin();
        fetchSuperAdmin();
        fetchAdmin();
        fetchUser();
        fetchTodayStatus();
    }, []);

    const fetchSuperAdmin = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_API_URL + '/dashboard/superadmin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setSuperAdmin(result.message[0]);
            } else {
                console.log('fetch data super admin failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchAdmin = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_API_URL + '/dashboard/admin', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setAdmin(result.message[0]);
            } else {
                console.log('fetch data admin failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_API_URL + '/dashboard/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setUser(result.message[0]);
            } else {
                console.log('fetch data user failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTodayStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_API_URL + '/dashboard/today_status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setTodayStatus(result.message[0]);
            } else {
                console.log('fetch data user failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
                <chakra.h1 textAlign={'center'} fontSize={'4xl'} py={10} fontWeight={'bold'}>
                    Super Admin Dashboard
                </chakra.h1>
                <Box mb={8}>
                    <Heading as="h2" size="md" mb={4}>
                        Status All
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
                        <StatsCard title={'Super Admin'} stat={superadmin?.total.toString() || ''} />
                        <StatsCard title={'Super Admin Enable'} stat={superadmin?.status_1_count.toString() || ''} />
                        <StatsCard title={'Super Admin Disable'} stat={superadmin?.status_0_count.toString() || ''} />
                        <StatsCard title={'Admin'} stat={admin?.total.toString() || ''} />
                        <StatsCard title={'Admin Enable'} stat={admin?.status_1_count.toString() || ''} />
                        <StatsCard title={'Admin Disable'} stat={admin?.status_0_count.toString() || ''} />
                        <StatsCard title={'User'} stat={user?.total.toString() || ''} />
                        <StatsCard title={'User Enable'} stat={user?.status_1_count.toString() || ''} />
                        <StatsCard title={'User Disable'} stat={user?.status_0_count.toString() || ''} />
                    </SimpleGrid>
                </Box>
                <Divider my={8} borderWidth="2px" borderColor="gray.500" />
                <Box mb={8}>
                    <Heading as="h2" size="md" mb={4}>
                        Today Status Users
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 8 }}>
                        <StatsCard title={'Total Active Users'} stat={today_status?.total_users.toString() || ''} />
                        <StatsCard title={'Leave'} stat={today_status?.leave_requests_count.toString() || ''} />
                        <StatsCard title={'Clock In'} stat={today_status?.timeclock_count.toString() || ''} />
                        <StatsCard title={'Not Clock In'} stat={((today_status?.total_users || 0) - (today_status?.leave_requests_count || 0) - (today_status?.timeclock_count || 0)).toString()} />
                    </SimpleGrid>
                </Box>
            </Box>
        </Layout>
    )
}