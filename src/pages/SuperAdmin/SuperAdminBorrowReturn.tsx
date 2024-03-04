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
import { checkLoginSuperAdmin } from '../../components/auth/checkLoginSuperAdmin';
import Layout from '../../components/common/Layout';
import Pagination from '../../components/Pagination';

interface Borrow_Return {
    borrow_id: Number;
    borrow_date: String;
    return_date: String;
    deleted: Number;
    equipment: String;
    rank_s: String;
    firstname: String;
    lastname: String;
}

const SuperAdminBorrowReturn = () => {
    const [borrow_return, setBorrowReturn] = useState<Borrow_Return[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(borrow_return.length / itemsPerPage);
    const [searchTerm, setSearchTerm] = useState<string>('');


    useEffect(() => {
        checkLoginSuperAdmin();
        fetchBorrowReturn();
    }, []);

    const fetchBorrowReturn = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/borrow/borrow_return`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setBorrowReturn(result.message);
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
                                <Th>Borrow Date</Th>
                                <Th>Return Date</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {borrow_return
                                .filter((data) => {
                                    const searchTermLower = searchTerm.toLowerCase();
                                    return data.equipment.toLowerCase().includes(searchTermLower)
                                        || data.borrow_date.toLowerCase().includes(searchTermLower)
                                        || (data.return_date && data.return_date.toLowerCase().includes(searchTermLower))
                                        || data.rank_s.toLowerCase().includes(searchTermLower)
                                        || data.firstname.toLowerCase().includes(searchTermLower)
                                        || data.lastname.toLowerCase().includes(searchTermLower);
                                })
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((data, index) => (
                                    <Tr key={index}>
                                        <Td>{data.equipment}</Td>
                                        <Td>{data.rank_s}{data.firstname} {data.lastname}</Td>
                                        <Td>{new Date(String(data.borrow_date)).toLocaleString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false })}</Td>
                                        <Td>{data.return_date ? new Date(String(data.return_date)).toLocaleString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false }) : ''}</Td>
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

export default SuperAdminBorrowReturn