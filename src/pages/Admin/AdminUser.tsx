import React, { useEffect, useState, FormEvent } from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    useDisclosure,
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
    Select,
    Flex,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react';
import { checkLoginAdmin } from '../../components/auth/checkLoginAdmin';
import Layout from '../../components/common/Layout';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';

interface User {
    user_id: number;
    firstname: string;
    lastname: string;
    rank_id: number;
    rank: string;
    rank_s: string;
    position_id: number;
    position: string;
    email: string;
    tel: string;
    password: string;
    code_verify: string;
    role: number;
    status: number;
    img_path: string;
}

interface Rank {
    rank_id: number;
    rank: string;
    rank_s: string;
}

interface Position {
    position_id: number;
    position: string;
}

const AdminUser = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [viewuser, setViewUser] = useState<User | null>(null);
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const { isOpen: isOpenModal1, onOpen: onOpenModal1, onClose: onCloseModal1 } = useDisclosure();
    const { isOpen: isOpenModal2, onOpen: onOpenModal2, onClose: onCloseModal2 } = useDisclosure();
    const { isOpen: isOpenModal3, onOpen: onOpenModal3, onClose: onCloseModal3 } = useDisclosure();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [formCreateData, setFormCreateData] = useState({
        firstname: '',
        lastname: '',
        rank: '',
        position: '',
        email: '',
        tel: '',
        password: '',
        role: 3,
        status: 1,
        img_path: '1',
    });
    const [formUpdateData, setFormUpdateData] = useState({
        user_id: '',
        firstname: '',
        lastname: '',
        rank_id: '',
        rank: '',
        rank_s: '',
        position_id: '',
        position: '',
        email: '',
        tel: '',
        password: '',
        code_verify: '',
        role: '',
        status: '',
        img_path: '1',
    });


    useEffect(() => {
        checkLoginAdmin();
        fetchUsers();
        fetchRanks();
        fetchPositions();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_API_URL + '/user/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setUsers(result.message);
            } else {
                console.log('fetch data admin failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchRanks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_API_URL + '/rank', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setRanks(result.message);
            } else {
                console.log('fetch data rank failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchPositions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_API_URL + '/position', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setPositions(result.message);
            } else {
                console.log('fetch data position failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchThisUser = async (user_id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/user/${user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                const userData = result.message[0];
                const { password_view, ...updatedFormData } = userData;
                setFormUpdateData({
                    ...updatedFormData,
                    password: userData.password_view,
                });
                onOpenModal2();
            } else {
                console.log('fetch data user failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchViewUser = async (user_id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/user/${user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                const userData = result.message[0];
                const { password_view, ...viewuser } = userData;
                setViewUser({
                    ...viewuser,
                    password: userData.password_view,
                });
                onOpenModal3();
            } else {
                console.log('fetch data user failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleInputCreateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormCreateData({
            ...formCreateData,
            [e.target.name]: e.target.value,
        });
    };

    const handleInputUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormUpdateData({
            ...formUpdateData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectCreateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormCreateData({
            ...formCreateData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSelectUpdateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormUpdateData({
            ...formUpdateData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const CreateUserSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formCreateData.firstname || !formCreateData.lastname || !formCreateData.rank || !formCreateData.position || !formCreateData.email || !formCreateData.tel || !formCreateData.password || !formCreateData.role || !formCreateData.status) {
            onCloseModal1();
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Form',
                text: 'Please fill in all required fields.',
                confirmButtonColor: '#3182CE',
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/create_user`, {
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
                setFormCreateData({
                    firstname: '',
                    lastname: '',
                    rank: '',
                    position: '',
                    email: '',
                    tel: '',
                    password: '',
                    role: 3,
                    status: 1,
                    img_path: '1',
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'User Added Successfully',
                    text: 'The user has been added to the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchUsers();
            } else if (result.status == 'error') {
                onCloseModal1();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add User',
                    text: 'There was an issue adding the user to the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchUsers();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const UpdateUserSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formUpdateData.firstname || !formUpdateData.lastname || !formUpdateData.rank || !formUpdateData.position || !formUpdateData.email || !formUpdateData.tel || !formUpdateData.password || !formUpdateData.role || !formUpdateData.status) {
            onCloseModal2();
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Form',
                text: 'Please fill in all required fields.',
                confirmButtonColor: '#3182CE',
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/update_user/${formUpdateData.user_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(formUpdateData),
            });

            const result = await response.json();

            if (result.status === 'success') {
                onCloseModal2();
                setFormUpdateData({
                    user_id: '',
                    firstname: '',
                    lastname: '',
                    rank_id: '',
                    rank: '',
                    rank_s: '',
                    position_id: '',
                    position: '',
                    email: '',
                    tel: '',
                    password: '',
                    code_verify: '',
                    role: '',
                    status: '',
                    img_path: '1',
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'User Updated Successfully',
                    text: 'The user has been updated in the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchUsers();
            } else if (result.status == 'error') {
                onCloseModal2();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Update User',
                    text: 'There was an issue updating the user in the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchUsers();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const DeleteUser = async (user_id: number) => {
        const result = await Swal.fire({
            title: 'Confirm Deletion',
            text: 'Do you want to delete this item?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3182CE',
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/delete_user/${user_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                });

                const result = await response.json();

                if (result.status == 'success') {
                    onCloseModal2();
                    await Swal.fire({
                        icon: 'success',
                        title: 'User Deleted Successfully',
                        text: 'The user has been deleted from the system.',
                        confirmButtonColor: '#3182CE',
                    });
                    fetchUsers();
                } else {
                    onCloseModal2();
                    await Swal.fire({
                        icon: 'error',
                        title: 'Failed to Delete User',
                        text: 'There was an issue deleting the user from the system.',
                        confirmButtonColor: '#3182CE',
                    });
                    fetchUsers();
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const GenerateCodeVerify = async (user_id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/generate_code_verify/${user_id}`, {
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
                    title: 'Verification Code Generated Successfully',
                    text: 'The verification code has been generated.',
                    confirmButtonColor: '#3182CE',
                });
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Generate Verification Code',
                    text: 'There was an issue generating the verification code.',
                    confirmButtonColor: '#3182CE',
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Layout>
                <Flex justify="space-between" align="center" mt={4}>
                    <Box>
                        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpenModal1}>
                            Create User
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
                    <Table variant='striped' colorScheme='blue'>
                        <Thead>
                            <Tr>
                                <Th>Name</Th>
                                <Th>Role</Th>
                                <Th>Status</Th>
                                <Th>Action</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {users
                                .filter((user) => {
                                    const searchTermLower = searchTerm.toLowerCase();
                                    return user.rank.toLowerCase().includes(searchTermLower)
                                        || user.rank_s.toLowerCase().includes(searchTermLower)
                                        || user.firstname.toLowerCase().includes(searchTermLower)
                                        || user.lastname.toLowerCase().includes(searchTermLower)
                                        || user.position.toLowerCase().includes(searchTermLower)
                                        || user.email.toLowerCase().includes(searchTermLower)
                                        || user.tel.toLowerCase().includes(searchTermLower)
                                        || (user.role === 1 ? 'Super Admin' : user.role === 2 ? 'Admin' : 'User').toLowerCase().includes(searchTermLower)
                                        || (user.status === 1 ? 'Enable' : 'Disable').toLowerCase().includes(searchTermLower);
                                })
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((user) => (
                                    <Tr key={user.user_id}>
                                        <Td>{user.rank_s + ' ' + user.firstname + ' ' + user.lastname}</Td>
                                        <Td>
                                            {user.role === 1 ? 'Super Admin' :
                                                user.role === 2 ? 'Admin' :
                                                    user.role === 3 ? 'User' : 'Unknown Role'}
                                        </Td>
                                        <Td>
                                            <Box as='button' borderRadius='md' bg={user.status == 1 ? 'green.500' : 'red.500'} color='white' px={4} h={8}>
                                                {user.status == 1 ? 'Enable' : 'Disable'}
                                            </Box>
                                        </Td>
                                        <Td>
                                            <Menu>
                                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={() => fetchViewUser(user.user_id)}>View</MenuItem>
                                                    <MenuItem onClick={() => GenerateCodeVerify(user.user_id)}>Generate Code Verify</MenuItem>
                                                    <MenuItem onClick={() => fetchThisUser(user.user_id)}>Update</MenuItem>
                                                    <MenuItem onClick={() => DeleteUser(user.user_id)}>Delete</MenuItem>
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
                            Create a new user
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Box>
                                    <FormLabel htmlFor='firstname'>First Name</FormLabel>
                                    <Input
                                        type='text'
                                        name='firstname'
                                        value={formCreateData.firstname}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter firstname'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='lastname'>Last Name</FormLabel>
                                    <Input
                                        type='text'
                                        name='lastname'
                                        value={formCreateData.lastname}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter lastname'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='rank'>Rank</FormLabel>
                                    <Select placeholder='Select option' name='rank' onChange={handleSelectCreateChange}>
                                        {ranks.map((rank) => (
                                            <option key={rank.rank_id} value={rank.rank_id}>
                                                {rank.rank}
                                            </option>
                                        ))}
                                    </Select>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='position'>Position</FormLabel>
                                    <Select placeholder='Select option' name='position' onChange={handleSelectCreateChange}>
                                        {positions.map((position) => (
                                            <option key={position.position_id} value={position.position_id}>
                                                {position.position}
                                            </option>
                                        ))}
                                    </Select>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='email'>E-mail</FormLabel>
                                    <Input
                                        type='text'
                                        name='email'
                                        value={formCreateData.email}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter email'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='tel'>Tel</FormLabel>
                                    <Input
                                        type='text'
                                        name='tel'
                                        value={formCreateData.tel}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter tel'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='password'>Password</FormLabel>
                                    <Input
                                        type='text'
                                        name='password'
                                        value={formCreateData.password}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter password'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='role'>Role</FormLabel>
                                    <Select name='role' onChange={handleSelectCreateChange} defaultValue='3'>
                                        <option value='2'>Admin</option>
                                        <option value='3'>User</option>
                                    </Select>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='status'>Status</FormLabel>
                                    <Select name='status' onChange={handleSelectCreateChange}>
                                        <option value='1'>Enable</option>
                                        <option value='0'>Disable</option>
                                    </Select>
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal1}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={CreateUserSubmit}>Submit</Button>
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
                            Update User
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Box>
                                    <FormLabel htmlFor='firstname'>First Name</FormLabel>
                                    <Input
                                        type='text'
                                        name='firstname'
                                        value={formUpdateData.firstname}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter firstname'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='lastname'>Last Name</FormLabel>
                                    <Input
                                        type='text'
                                        name='lastname'
                                        value={formUpdateData.lastname}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter lastname'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='rank'>Rank</FormLabel>
                                    <Select placeholder='Select option' name='rank_id' defaultValue={formUpdateData.rank_id} onChange={handleSelectUpdateChange}>
                                        {ranks.map((rank) => (
                                            <option key={rank.rank_id} value={rank.rank_id}>
                                                {rank.rank}
                                            </option>
                                        ))}
                                    </Select>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='position'>Position</FormLabel>
                                    <Select placeholder='Select option' name='position_id' defaultValue={formUpdateData.position_id} onChange={handleSelectUpdateChange}>
                                        {positions.map((position) => (
                                            <option key={position.position_id} value={position.position_id}>
                                                {position.position}
                                            </option>
                                        ))}
                                    </Select>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='email'>E-mail</FormLabel>
                                    <Input
                                        type='text'
                                        name='email'
                                        value={formUpdateData.email}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter email'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='tel'>Tel</FormLabel>
                                    <Input
                                        type='text'
                                        name='tel'
                                        value={formUpdateData.tel}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter tel'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='password'>Password</FormLabel>
                                    <Input
                                        type='text'
                                        name='password'
                                        value={formUpdateData.password}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter password'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='role'>Role</FormLabel>
                                    <Select name='role' onChange={handleSelectUpdateChange} defaultValue={formUpdateData.role}>
                                        <option value='2'>Admin</option>
                                        <option value='3'>User</option>
                                    </Select>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='status'>Status</FormLabel>
                                    <Select name='status' onChange={handleSelectUpdateChange} defaultValue={formUpdateData.status}>
                                        <option value='1'>Enable</option>
                                        <option value='0'>Disable</option>
                                    </Select>
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal2}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={UpdateUserSubmit}>Submit</Button>
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
                            View User
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Box>
                                    <FormLabel htmlFor='name'>Name</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel>{viewuser?.rank_s} {viewuser?.firstname} {viewuser?.lastname}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='position'>Position</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel>{viewuser?.position}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='email'>E-mail</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel>{viewuser?.email}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='tel'>Tel</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel>{viewuser?.tel}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='password'>Password</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel>{viewuser?.password}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='code_verify'>Code Verify</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel>{viewuser?.code_verify || 'No Code Verify'}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='role'>Role</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel>{viewuser?.role == 1 ? 'Super Admin' : viewuser?.role == 2 ? 'Admin' : 'User'}</FormLabel>
                                    </Box>
                                </Box>


                                <Box>
                                    <FormLabel htmlFor='status'>Status</FormLabel>
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <Box as="button" borderRadius="md" bg={viewuser?.status === 1 ? 'green.500' : 'red.500'} color="white" px={4} h={10}>
                                            <FormLabel>{viewuser?.status === 1 ? 'Enable' : 'Disable'}</FormLabel>
                                        </Box>
                                    </Box>
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal3}>
                                Close
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Layout>
        </>
    )
}

export default AdminUser