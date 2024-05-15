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
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Input,
    Stack,
    Box,
    FormLabel,
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Flex,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import { checkLoginAdmin } from '../../components/auth/checkLoginAdmin';
import Layout from '../../components/common/Layout';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';

interface Leave {
    leave_requests_id: number;
    user_id: number;
    leave_type: number;
    description: string;
    start_date: string;
    end_date: string;
    leave_requests_status: number;
    rank_s: string;
    firstname: string;
    lastname: string;
}

const AdminAcceptLeave = () => {
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const { isOpen: isOpenModal2, onOpen: onOpenModal2, onClose: onCloseModal2 } = useDisclosure();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(leaves.length / itemsPerPage);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [formUpdateData, setFormUpdateData] = useState({
        leave_requests_id: 0,
        user_id: 0,
        leave_type: 1,
        description: '',
        start_date: '',
        end_date: '',
        leave_requests_status: 2,
        rank_s: '',
        firstname: '',
        lastname: '',
    });


    useEffect(() => {
        checkLoginAdmin();
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/leave`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status === 'success') {
                setLeaves(result.message);
            } else {
                console.log('fetch data task failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const ViewLeave = async (leave_requests_id: number) => {
        fetchThisLeave(leave_requests_id);
        onOpenModal2();
    };

    const fetchThisLeave = async (leave_requests_id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/leave/${leave_requests_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status === 'success') {
                setFormUpdateData(result.message[0]);
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

    const ChangeStatus = async (leave_requests_id: number) => {
        const result = await Swal.fire({
            title: 'Leave Approval',
            text: 'Do you want to approve this leave request?',
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: 'Approve',
            denyButtonText: 'Deny',
            confirmButtonColor: '#3182CE',
        });

        if (result.isConfirmed) {
            const result = await Swal.fire({
                title: 'Confirm Leave Approval',
                text: 'Do you want to approve this leave?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Approve',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#3182CE',
            });

            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/leave/change_status/${leave_requests_id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: 'Bearer ' + token,
                        },
                        body: JSON.stringify({ status: 1 }),
                    });

                    const result = await response.json();

                    if (result.status === 'success') {
                        await Swal.fire({
                            icon: 'success',
                            title: 'Leave Approved Successfully',
                            text: 'The leave has been approved in the system.',
                            confirmButtonColor: '#3182CE',
                        });
                        fetchLeaves();
                    } else if (result.status === 'error') {
                        await Swal.fire({
                            icon: 'error',
                            title: 'Failed to Approve Leave',
                            text: 'There was an issue approving the leave in the system.',
                            confirmButtonColor: '#3182CE',
                        });
                        fetchLeaves();
                    } else {
                        alert('Failed')
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        } else if (result.isDenied) {
            const result = await Swal.fire({
                title: 'Confirm Leave Denial',
                text: 'Do you want to deny this leave?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Deny',
                cancelButtonText: 'Cancel',
                confirmButtonColor: '#3182CE',
            });

            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/leave/change_status/${leave_requests_id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: 'Bearer ' + token,
                        },
                        body: JSON.stringify({ status: 3 }),
                    });

                    const result = await response.json();

                    if (result.status === 'success') {
                        await Swal.fire({
                            icon: 'success',
                            title: 'Leave Approved Successfully',
                            text: 'The leave has been approved in the system.',
                            confirmButtonColor: '#3182CE',
                        });
                        fetchLeaves();
                    } else if (result.status === 'error') {
                        await Swal.fire({
                            icon: 'error',
                            title: 'Leave Not Approved',
                            text: 'There was an issue with the approval process. The leave has not been approved.',
                            confirmButtonColor: '#3182CE',
                        });
                        fetchLeaves();
                    } else {
                        alert('Failed')
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        }
    };

    return (
        <>
            <Layout>
                <Flex justify="right" align="center" mt={4}>
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
                                <Th>Leave Type</Th>
                                <Th>Name</Th>
                                <Th>Start Date</Th>
                                <Th>End Date</Th>
                                <Th>Status</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {leaves
                                .filter((leave) => {
                                    const searchTermLower = searchTerm.toLowerCase();
                                    return (leave.leave_type === 1 ? 'Sick Leave' : 'Personal Leave').toLowerCase().includes(searchTermLower)
                                        || leave.description.toLowerCase().includes(searchTermLower)
                                        || leave.start_date.toLowerCase().includes(searchTermLower)
                                        || leave.end_date.toLowerCase().includes(searchTermLower)
                                        || (leave.leave_requests_status === 1 ? 'Approved' : leave.leave_requests_status === 2 ? 'Pending' : 'Denied').toLowerCase().includes(searchTermLower);
                                })
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((leave) => (
                                    <Tr key={leave.leave_requests_id}>
                                        <Td>{leave.leave_type === 1 ? 'Sick Leave' : 'Personal Leave'}</Td>
                                        <Td>{leave.rank_s}{leave.firstname} {leave.lastname}</Td>
                                        <Td>{new Date(leave.start_date).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Td>
                                        <Td>{new Date(leave.end_date).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Td>
                                        <Td>
                                            <Box as='button' borderRadius='md' bg={leave.leave_requests_status === 1 ? 'green.500' : leave.leave_requests_status === 2 ? 'yellow.500' : 'red.500'} color='white' px={4} h={8}>
                                                {leave.leave_requests_status === 1 ? 'Approved' : leave.leave_requests_status === 2 ? 'Pending' : 'Denied'}
                                            </Box>
                                        </Td>
                                        <Td>
                                            <Menu>
                                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={() => ViewLeave(leave.leave_requests_id)}>View Leave</MenuItem>
                                                    <MenuItem onClick={() => ChangeStatus(leave.leave_requests_id)}>Change Status</MenuItem>
                                                </MenuList>
                                            </Menu>
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
                <Drawer
                    isOpen={isOpenModal2}
                    placement='right'
                    onClose={onCloseModal2}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth='1px'>
                            View Leave
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Box>
                                    <FormLabel htmlFor='leave_type'>Name</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel htmlFor='name'>{formUpdateData.rank_s}{formUpdateData.firstname} {formUpdateData.lastname}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='leave_type'>Leave Type</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel htmlFor='leave_type'>{formUpdateData.leave_type === 1 ? 'Sick Leave' : formUpdateData.leave_type === 2 ? 'Personal Leave' : 'No Leave Type'}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='description'>Description</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel htmlFor='description'>{formUpdateData.description}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='start_date'>Start Date</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel htmlFor='start_date'>{new Date(formUpdateData.start_date).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='end_date'>End Date</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel htmlFor='end_date'>{new Date(formUpdateData.end_date).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='status'>Status</FormLabel>
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <Box as='button' borderRadius='md' bg={formUpdateData.leave_requests_status === 1 ? 'green.500' : formUpdateData.leave_requests_status === 2 ? 'yellow.500' : 'red.500'} color='white' px={4} h={8}>
                                            <FormLabel htmlFor='description'>{formUpdateData.leave_requests_status === 1 ? 'Approved' : formUpdateData.leave_requests_status === 2 ? 'Pending' : 'Denied'}</FormLabel>
                                        </Box>
                                    </Box>
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal2}>
                                Close
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Layout>
        </>
    )
}

export default AdminAcceptLeave