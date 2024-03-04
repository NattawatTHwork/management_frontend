import { useEffect, useState } from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
    Input,
    Box,
    Flex,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react';
import { checkLoginUser } from '../../components/auth/checkLoginUser';
import Layout from '../../components/common/Layout';
import Pagination from '../../components/Pagination';

interface Equipment_status {
    equipment_id: number;
    equipment: string;
    status: number;
    deleted: number;
    borrow_id: number;
    user_id: number;
    borrow_date: String;
    return_date: String;
    rank_s: string;
    firstname: string;
    lastname: string;
}

const UserEquipmentStatus = () => {
    const [equipment_status, setEquipmentStatus] = useState<Equipment_status[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(equipment_status.length / itemsPerPage);
    const [searchTerm, setSearchTerm] = useState<string>('');


    useEffect(() => {
        checkLoginUser();
        fetchEquipmentStatus();
    }, []);

    const fetchEquipmentStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/equipment/equipment_status`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setEquipmentStatus(result.message);
            } else {
                console.log('fetch data task failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <Layout>
                <Flex justify="flex-end" align="center" mt={4}>
                    <Box>
                        <InputGroup>
                            <Input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={() => setSearchTerm('')}>
                                    Clear
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </Box>
                </Flex>
                <TableContainer>
                    <Table variant='striped' colorScheme='blue'>
                        <Thead>
                            <Tr>
                                <Th>Equipment Name</Th>
                                <Th>User Borrow</Th>
                                <Th>Status</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {equipment_status
                                .filter((status) => {
                                    const searchTermLower = searchTerm.toLowerCase();
                                    return status.equipment.toLowerCase().includes(searchTermLower) ||
                                        (status.borrow_date != null && status.return_date == null && (
                                            (status.rank_s && status.rank_s.toLowerCase().includes(searchTermLower)) ||
                                            (status.firstname && status.firstname.toLowerCase().includes(searchTermLower)) ||
                                            (status.lastname && status.lastname.toLowerCase().includes(searchTermLower))
                                        ));
                                })
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((status, index) => (
                                    <Tr key={index}>
                                        <Td>{status.equipment}</Td>
                                        <Td>{status.borrow_date != null && status.return_date == null && (status.rank_s + status.firstname + ' ' + status.lastname)}</Td>
                                        <Td>
                                            <Box as='button' borderRadius='md' bg={status.borrow_date != null && status.return_date == null ? 'red.500' : 'green.500'} color='white' px={4} h={8}>
                                                {status.borrow_date != null && status.return_date == null ? 'Not Borrowable' : 'Borrowable'}
                                            </Box>
                                        </Td>
                                    </Tr>
                                ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

            </Layout>
        </>
    )
}

export default UserEquipmentStatus