import React, { useEffect, useState, FormEvent } from 'react'
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
    Select,
    Flex,
    InputGroup,
    InputRightElement,
    Textarea
} from '@chakra-ui/react';
import { checkLoginUser } from '../../components/auth/checkLoginUser';
import Layout from '../../components/common/Layout';
import { AddIcon, ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';

interface Leave {
    leave_requests_id: number;
    user_id: number;
    leave_type: number;
    description: string;
    start_date: string;
    end_date: string;
    status: number;
}

const UserLeave = () => {
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const { isOpen: isOpenModal1, onOpen: onOpenModal1, onClose: onCloseModal1 } = useDisclosure();
    const { isOpen: isOpenModal2, onOpen: onOpenModal2, onClose: onCloseModal2 } = useDisclosure();
    const { isOpen: isOpenModal3, onOpen: onOpenModal3, onClose: onCloseModal3 } = useDisclosure();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(leaves.length / itemsPerPage);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [formCreateData, setFormCreateData] = useState({
        user_id: 0,
        leave_type: 1,
        description: '',
        start_date: '',
        end_date: '',
    });
    const [formUpdateData, setFormUpdateData] = useState({
        leave_requests_id: 0,
        user_id: 0,
        leave_type: 1,
        description: '',
        start_date: '',
        end_date: '',
        status: 2,
        deleted: 1,
    });


    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const decoded = await checkLoginUser();
            setFormCreateData({
                user_id: decoded.user_id,
                leave_type: 1,
                description: '',
                start_date: '',
                end_date: '',
            });
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/leave/my_leave/${decoded.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
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

    const UpdateLeave = async (leave_requests_id: number) => {
        fetchThisLeave(leave_requests_id);
        onOpenModal3();
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

            if (result.status == 'success') {
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

    const handleInputCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormCreateData({
            ...formCreateData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectCreateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormCreateData({
            ...formCreateData,
            [e.target.name]: e.target.value,
        });
    };

    const handleInputUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormUpdateData({
            ...formUpdateData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectUpdateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormUpdateData({
            ...formUpdateData,
            [e.target.name]: e.target.value,
        });
    };

    const CreateLeaveSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formCreateData.user_id
            || !formCreateData.leave_type
            || !formCreateData.description
            || !formCreateData.start_date
            || !formCreateData.end_date) {
            onCloseModal1();
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Form',
                text: 'Please fill in all required fields.',
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/leave/create_leave`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(formCreateData),
            });

            const result = await response.json();

            if (result.status === 'success') {
                onCloseModal1();
                await Swal.fire({
                    icon: 'success',
                    title: 'Leave Added Successfully',
                    text: 'The leave has been added to the system.',
                });
                fetchLeaves();
            } else if (result.status == 'error') {
                onCloseModal1();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add Leave',
                    text: 'There was an issue adding the leave to the system.',
                });
                fetchLeaves();
            } else if (result.status == 'overlap') {
                onCloseModal1();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add Leave',
                    text: 'There is an overlap in the leave dates. Please choose different dates.',
                });
                fetchLeaves();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const UpdateLeaveSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formUpdateData.leave_requests_id || !formUpdateData.leave_type || !formUpdateData.description || !formUpdateData.start_date || !formUpdateData.end_date) {
            onCloseModal3();
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Form',
                text: 'Please fill in all required fields.',
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/leave/update_leave/${formUpdateData.leave_requests_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(formUpdateData),
            });

            const result = await response.json();

            if (result.status === 'success') {
                onCloseModal3();
                setFormUpdateData({
                    leave_requests_id: 0,
                    user_id: 0,
                    leave_type: 1,
                    description: '',
                    start_date: '',
                    end_date: '',
                    status: 2,
                    deleted: 1,
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'Leave Updated Successfully',
                    text: 'The leave has been updated in the system.',
                });
                fetchLeaves();
            } else if (result.status == 'error') {
                onCloseModal3();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Update Leave',
                    text: 'There was an issue updating the leave in the system.',
                });
                fetchLeaves();
            } else if (result.status == 'nofound') {
                onCloseModal3();
                await Swal.fire({
                    icon: 'error',
                    title: 'Leave not found',
                    text: 'The leave request was not found in the system.',
                });
                fetchLeaves();
            } else if (result.status == 'cant_update') {
                onCloseModal3();
                await Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'The leave request cannot be updated as its status has been modified by an administrator.',
                });
                fetchLeaves();
            } else if (result.status == 'overlap') {
                onCloseModal3();
                await Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'The leave request cannot be updated due to an overlap in leave dates.',
                });
                fetchLeaves();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const DeleteLeave = async (leave_requests_id: number) => {
        const result = await Swal.fire({
            title: 'Confirm Deletion',
            text: 'Do you want to delete this item?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/leave/delete_leave/${leave_requests_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                });

                const result = await response.json();

                if (result.status == 'success') {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Task Deleted Successfully',
                        text: 'The task has been deleted from the system.',
                    });
                    fetchLeaves();
                } else if (result.status == 'error') {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Failed to Delete Task',
                        text: 'There was an issue deleting the task from the system.',
                    });
                    fetchLeaves();
                } else if (result.status == 'nofound') {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Leave not found',
                        text: 'The leave request was not found in the system.',
                    });
                    fetchLeaves();
                } else if (result.status == 'cant_update') {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Update Failed',
                        text: 'The leave request cannot be updated as its status has been modified by an administrator.',
                    });
                    fetchLeaves();
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const formatDateTimeLocal = (isoString: string) => {
        if (!isoString) {
            return '';
        }

        const date = new Date(isoString);
        const year = date.getFullYear().toString().padStart(4, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            <Layout>
                <Flex justify="space-between" align="center" mt={4}>
                    <Box>
                        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpenModal1}>
                            Create Leave
                        </Button>
                    </Box>
                    <Box >
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
                    <Table variant='striped' colorScheme='teal'>
                        <Thead>
                            <Tr>
                                <Th>Task</Th>
                                <Th>Date Time</Th>
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
                                        || (leave.status === 1 ? 'Approved' : leave.status === 2 ? 'Pending' : 'Denied').toLowerCase().includes(searchTermLower);
                                })
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((leave) => (
                                    <Tr key={leave.leave_requests_id}>
                                        <Td>{leave.leave_type === 1 ? 'Sick Leave' : 'Personal Leave'}</Td>
                                        <Td>{new Date(leave.start_date).toLocaleDateString('en-TH')}</Td>
                                        <Td>{new Date(leave.end_date).toLocaleDateString('en-TH')}</Td>
                                        <Td>
                                            <Box as='button' borderRadius='md' bg={leave.status === 1 ? 'green.500' : leave.status === 2 ? 'yellow.500' : 'red.500'} color='white' px={4} h={8}>
                                                {leave.status === 1 ? 'Approved' : leave.status === 2 ? 'Pending' : 'Denied'}
                                            </Box>
                                        </Td>
                                        <Td>
                                            <Menu>
                                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={() => ViewLeave(leave.leave_requests_id)}>View Leave</MenuItem>
                                                    <MenuItem onClick={() => UpdateLeave(leave.leave_requests_id)}>Update Leave</MenuItem>
                                                    <MenuItem onClick={() => DeleteLeave(leave.leave_requests_id)}>Delete Leave</MenuItem>
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
                    isOpen={isOpenModal1}
                    placement='right'
                    onClose={onCloseModal1}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth='1px'>
                            Create Leave
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Box>
                                    <FormLabel htmlFor='leave_type'>Leave Type</FormLabel>
                                    <Select name='leave_type' onChange={handleSelectCreateChange} defaultValue='1'>
                                        <option value='1'>Sick Leave</option>
                                        <option value='2'>Personal Leave</option>
                                    </Select>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='description'>Description</FormLabel>
                                    <Textarea
                                        name='description'
                                        value={formCreateData.description}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter full description'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='start_date'>Start Date</FormLabel>
                                    <Input
                                        type='date'
                                        name='start_date'
                                        value={formCreateData.start_date}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter start date'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='end_date'>End Date</FormLabel>
                                    <Input
                                        type='date'
                                        name='end_date'
                                        value={formCreateData.end_date}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter end date'
                                    />
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal1}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={CreateLeaveSubmit}>Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

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
                                        <FormLabel htmlFor='start_date'>{new Date(formUpdateData.start_date).toLocaleDateString('en-TH')}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='end_date'>End Date</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel htmlFor='end_date'>{new Date(formUpdateData.end_date).toLocaleDateString('en-TH')}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='status'>Status</FormLabel>
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <Box as='button' borderRadius='md' bg={formUpdateData.status === 1 ? 'green.500' : formUpdateData.status === 2 ? 'yellow.500' : 'red.500'} color='white' px={4} h={8}>
                                            <FormLabel htmlFor='description'>{formUpdateData.status === 1 ? 'Approved' : formUpdateData.status === 2 ? 'Pending' : 'Denied'}</FormLabel>
                                        </Box>
                                    </Box>
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal2}>
                                Close
                            </Button>
                            {/* <Button colorScheme='blue' onClick={CreateResponsibleSubmit}>Submit</Button> */}
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <Drawer
                    isOpen={isOpenModal3}
                    placement='right'
                    onClose={onCloseModal3}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth='1px'>
                            Update Leave
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                {/* <Input
                                    type='hidden'
                                    name='leave_requests_id'
                                    value={formUpdateData.leave_requests_id}
                                />

                                <Input
                                    type='hidden'
                                    name='user_id'
                                    value={formUpdateData.user_id}
                                /> */}

                                <Box>
                                    <FormLabel htmlFor='leave_type'>Leave Type</FormLabel>
                                    <Select name='leave_type' onChange={handleSelectUpdateChange} defaultValue={formUpdateData.leave_type}>
                                        <option value='1'>Sick Leave</option>
                                        <option value='2'>Personal Leave</option>
                                    </Select>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='description'>Description</FormLabel>
                                    <Textarea
                                        name='description'
                                        value={formUpdateData.description}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter full description'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='start_date'>Start Date</FormLabel>
                                    <Input
                                        type='date'
                                        name='start_date'
                                        value={formatDateTimeLocal(formUpdateData.start_date)}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter start date'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='end_date'>End Date</FormLabel>
                                    <Input
                                        type='date'
                                        name='end_date'
                                        value={formatDateTimeLocal(formUpdateData.end_date)}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter end date'
                                    />
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal3}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={UpdateLeaveSubmit}>Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Layout>
        </>
    )
}

export default UserLeave