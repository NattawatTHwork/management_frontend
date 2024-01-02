import {
    Box,
    chakra,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    Heading,
} from '@chakra-ui/react'
import Layout from '../../components/common/Layout'
import { useEffect, useState } from 'react'
import { checkLoginUser } from '../../components/auth/checkLoginUser'

interface StatsCardProps {
    title: string
    stat: string
    time: string
}
function StatsCard(props: StatsCardProps) {
    const { title, stat, time } = props
    return (
        <Stat
            px={{ base: 4, md: 8 }}
            py={'5'}
            shadow={'xl'}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.800', 'gray.500')}
            rounded={'lg'}>
            <StatLabel fontSize="2xl" fontWeight="bold" isTruncated>
                {title}
            </StatLabel>
            <StatNumber fontSize="xl" fontWeight="light">
                {stat}
            </StatNumber>
            <StatNumber fontSize="xl" fontWeight="light">
                {time}
            </StatNumber>
        </Stat>
    )
}

interface today_task {
    responsible_id: number;
    task_id: number;
    title: string;
    description: string;
    schedule: string;
}

export default function UserDashboard() {
    const [today_task, setTodayTask] = useState<today_task[]>([]);

    useEffect(() => {
        fetchTodayTask();
    }, []);

    const fetchTodayTask = async () => {
        try {
            const decoded = await checkLoginUser();
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/dashboard/today_task/${decoded.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setTodayTask(result.message);
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
                    User Dashboard
                </chakra.h1>
                <Box mb={8}>
                    <Heading as="h2" size="md" mb={4}>
                        Today Task
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 1 }} spacing={{ base: 5, lg: 8 }}>
                        {today_task.map((task) => (
                            <StatsCard title={task?.title || ''} stat={task?.description || ''}  time={new Date(task.schedule).toLocaleString('th-TH', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                second: 'numeric',
                                hour12: false
                              }) || ''} />
                        ))}
                    </SimpleGrid>
                </Box>
            </Box>
        </Layout>

    )
}