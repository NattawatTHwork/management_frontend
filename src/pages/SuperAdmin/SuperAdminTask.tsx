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
    InputRightElement
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon, DeleteIcon } from '@chakra-ui/icons';
import { checkLoginSuperAdmin } from '../../components/auth/checkLoginSuperAdmin';
import Layout from '../../components/common/Layout';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';

interface Task {
    task_id: number;
    title: string;
    description: string;
    schedule: string;
    status: number;
}

interface User {
    user_id: number;
    firstname: string;
    lastname: string;
    rank: string;
    rank_s: string;
    position: string;
    email: string;
    tel: string;
    code_verify: string;
    role: number;
    status: number;
    img_path: string;
}

const SuperAdminTask = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const { isOpen: isOpenModal1, onOpen: onOpenModal1, onClose: onCloseModal1 } = useDisclosure();
    const { isOpen: isOpenModal2, onOpen: onOpenModal2, onClose: onCloseModal2 } = useDisclosure();
    const { isOpen: isOpenModal3, onOpen: onOpenModal3, onClose: onCloseModal3 } = useDisclosure();
    const { isOpen: isOpenModal4, onOpen: onOpenModal4, onClose: onCloseModal4 } = useDisclosure();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(tasks.length / itemsPerPage);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [formCreateData, setFormCreateData] = useState({
        title: '',
        description: '',
        schedule: '',
    });
    const [formUpdateData, setFormUpdateData] = useState({
        task_id: 0,
        title: '',
        description: '',
        schedule: '',
        status: '',
    });

    const [formAddResponsible, setFormAddResponsible] = useState({
        task_id: 0,
        title: '',
        user_id: [] as string[]
    });

    const [formUpdateResponsible, setFormUpdateResponsible] = useState({
        task_id: 0,
        title: '',
        user_id: [] as string[],
        responsible_id: [] as number[],
        rank: [] as string[],
        rank_s: [] as string[],
        firstname: [] as string[],
        lastname: [] as string[],
        status: [] as number[],
        deleted: [] as number[],
    });

    useEffect(() => {
        checkLoginSuperAdmin();
        fetchTasks();
        fetchUsers();
    }, []);

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_API_URL + '/task', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status === 'success') {
                setTasks(result.message);
            } else {
                console.log('fetch data task failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

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

            if (result.status === 'success') {
                setUsers(result.message);
            } else {
                console.log('fetch data admin failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchThisTask = async (task_id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/task/${task_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status === 'success') {
                setFormUpdateData(result.message[0]);
                onOpenModal2();
            } else {
                console.log('fetch data task failed')
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

    const handleSelectAddChange = (index: number, selectedValue: string) => {
        setFormAddResponsible((prevState) => {
            const updatedUserIds = [...prevState.user_id];
            updatedUserIds[index] = selectedValue;

            return {
                ...prevState,
                user_id: updatedUserIds
            };
        });
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const CreateTaskSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formCreateData.title || !formCreateData.description || !formCreateData.schedule) {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/task/create_task`, {
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
                    title: '',
                    description: '',
                    schedule: '',
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'Task Added Successfully',
                    text: 'The task has been added to the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchTasks();
            } else if (result.status === 'error') {
                onCloseModal1();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add Task',
                    text: 'There was an issue adding the task to the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchTasks();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const UpdateTaskSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formUpdateData.task_id || !formUpdateData.title || !formUpdateData.description || !formUpdateData.schedule) {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/task/update_task/${formUpdateData.task_id}`, {
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
                    task_id: 0,
                    title: '',
                    description: '',
                    schedule: '',
                    status: '',
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'Task Updated Successfully',
                    text: 'The task has been updated in the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchTasks();
            } else if (result.status === 'error') {
                onCloseModal2();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Update Task',
                    text: 'There was an issue updating the task in the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchTasks();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const DeleteTask = async (task_id: number) => {
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
                const response = await fetch(`${process.env.REACT_APP_API_URL}/task/delete_task/${task_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                });

                const result = await response.json();

                if (result.status === 'success') {
                    onCloseModal2();
                    await Swal.fire({
                        icon: 'success',
                        title: 'Task Deleted Successfully',
                        text: 'The task has been deleted from the system.',
                        confirmButtonColor: '#3182CE',
                    });
                    fetchTasks();
                } else {
                    onCloseModal2();
                    await Swal.fire({
                        icon: 'error',
                        title: 'Failed to Delete Task',
                        text: 'There was an issue deleting the task from the system.',
                        confirmButtonColor: '#3182CE',
                    });
                    fetchTasks();
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const PrepareResponsible = (task_id: number, title: string) => {
        setFormAddResponsible({
            ...formAddResponsible,
            task_id: task_id,
            title: title
        });
        onOpenModal3();
    };

    const [count, setCount] = useState(1);
    const boxesAdd = [];
    for (let i = 0; i < count; i++) {
        boxesAdd.push(
            <Box key={i}>
                <FormLabel htmlFor={`user_id${i}`}>Responsible {i + 1}</FormLabel>
                <Select
                    placeholder='Select option'
                    name={`user_id${i}`}
                    onChange={(e) => handleSelectAddChange(i, e.target.value)}
                >
                    {users.filter((user) => user.status === 1)
                        .map((user) => (
                            <option key={user.user_id} value={user.user_id}>
                                {user.rank} {user.firstname} {user.lastname}
                            </option>
                        ))}
                </Select>
            </Box>
        );
    }

    const countRes = formUpdateResponsible.responsible_id.length;
    const boxesUpdate = [];
    if (countRes > 0) {
        for (let i = 0; i < countRes; i++) {
            boxesUpdate.push(
                <Box key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <FormLabel htmlFor={`user_id${i}`}>{i + 1}. {formUpdateResponsible.rank_s[i]} {formUpdateResponsible.firstname[i]} {formUpdateResponsible.lastname[i]}</FormLabel>
                    <DeleteIcon onClick={() => DeleteResponsible(formUpdateResponsible.responsible_id[i])} />
                </Box>
            );
        }
    } else {
        boxesUpdate.push(
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
                <FormLabel>No Responsible</FormLabel>
            </Box >
        );
    }

    const resetUser_id = () => {
        setFormAddResponsible({
            task_id: 0,
            title: '',
            user_id: [] as string[]
        })
        onCloseModal3();
    }

    const CreateResponsibleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formAddResponsible.task_id || !formAddResponsible.user_id) {
            onCloseModal3();
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/task/add_responsible`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(formAddResponsible),
            });

            const result = await response.json();

            if (result.status === 'success') {
                resetUser_id();
                await Swal.fire({
                    icon: 'success',
                    title: 'Responsible Added Successfully',
                    text: 'The responsible has been added to the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchTasks();
            } else if (result.status === 'error') {
                onCloseModal1();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add Responsible',
                    text: 'There was an issue adding the responsible to the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchTasks();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchThisResponsible = async (task_id: number, title: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/task/responsible/${task_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status === 'success') {
                setFormUpdateResponsible(result.message);
                onOpenModal4();
            } else if (result.status === 'no_responsible') {
                setFormUpdateResponsible({
                    task_id: task_id,
                    title: title,
                    user_id: [],
                    responsible_id: [],
                    rank: [],
                    rank_s: [],
                    firstname: [],
                    lastname: [],
                    status: [],
                    deleted: [],
                });
                onOpenModal4();
            } else {
                console.log('fetch data task failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const DeleteResponsible = async (responsible_id: number) => {
        onCloseModal4();
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
                const response = await fetch(`${process.env.REACT_APP_API_URL}/task/delete_responsible/${responsible_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                });

                const result = await response.json();

                if (result.status === 'success') {
                    await Swal.fire({
                        icon: 'success',
                        title: 'REsponsible Deleted Successfully',
                        text: 'The responsible has been deleted from the system.',
                        confirmButtonColor: '#3182CE',
                    });
                    onOpenModal4();
                    fetchThisResponsible(formUpdateResponsible.task_id, formUpdateResponsible.title);
                } else {
                    await Swal.fire({
                        icon: 'error',
                        title: 'Failed to Delete Responsible',
                        text: 'There was an issue deleting the responsible from the system.',
                        confirmButtonColor: '#3182CE',
                    });
                    onOpenModal4();
                    fetchThisResponsible(formUpdateResponsible.task_id, formUpdateResponsible.title);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            onOpenModal4();
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
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <>
            <Layout>
                <Flex justify="space-between" align="center" mt={4}>
                    <Box>
                        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpenModal1}>
                            Create Task
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
                                <Th>Task</Th>
                                <Th>Date Time</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {tasks
                                .filter((task) => {
                                    const searchTermLower = searchTerm.toLowerCase();
                                    return task.title.toLowerCase().includes(searchTermLower)
                                        || task.description.toLowerCase().includes(searchTermLower)
                                        || task.schedule.toLowerCase().includes(searchTermLower)
                                        || (task.status === 1 ? 'Enable' : 'Disable').toLowerCase().includes(searchTermLower);
                                })
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((task) => (
                                    <Tr key={task.task_id}>
                                        <Td>{task.title}</Td>
                                        <Td>{new Date(task.schedule).toLocaleString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false })}</Td>
                                        <Td>
                                            <Menu>
                                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={() => PrepareResponsible(task.task_id, task.title)}>Add Responsible</MenuItem>
                                                    <MenuItem onClick={() => fetchThisResponsible(task.task_id, task.title)}>View Responsible</MenuItem>
                                                    <MenuItem onClick={() => fetchThisTask(task.task_id)}>Update Task</MenuItem>
                                                    <MenuItem onClick={() => DeleteTask(task.task_id)}>Delete Task</MenuItem>
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
                            Create a new task
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Box>
                                    <FormLabel htmlFor='title'>Title</FormLabel>
                                    <Input
                                        type='text'
                                        name='title'
                                        value={formCreateData.title}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter full title'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='description'>Description</FormLabel>
                                    <Input
                                        type='text'
                                        name='description'
                                        value={formCreateData.description}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter short rank'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='schedule'>Schedule</FormLabel>
                                    <Input
                                        type='datetime-local'
                                        name='schedule'
                                        value={formCreateData.schedule}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter schedule'
                                    />
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal1}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={CreateTaskSubmit}>Submit</Button>
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
                            Update task
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Input
                                    type='hidden'
                                    name='task_id'
                                    value={formUpdateData.task_id}
                                />

                                <Box>
                                    <FormLabel htmlFor='title'>Title</FormLabel>
                                    <Input
                                        type='text'
                                        name='title'
                                        value={formUpdateData.title}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter full title'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='description'>Description</FormLabel>
                                    <Input
                                        type='text'
                                        name='description'
                                        value={formUpdateData.description}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter short rank'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='schedule'>Schedule</FormLabel>
                                    <Input
                                        type='datetime-local'
                                        name='schedule'
                                        value={formatDateTimeLocal(formUpdateData.schedule)}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter schedule'
                                    />
                                </Box>

                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal2}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={UpdateTaskSubmit}>Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <Drawer
                    isOpen={isOpenModal3}
                    placement='right'
                    onClose={resetUser_id}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth='1px'>
                            Add Responsible
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Input
                                    type='hidden'
                                    name='task_id'
                                    value={formAddResponsible.task_id}
                                />

                                <Box>
                                    <FormLabel htmlFor='title'>Title</FormLabel>
                                    <FormLabel htmlFor='title'>{formAddResponsible.title}</FormLabel>
                                </Box>

                                <Box>
                                    {boxesAdd}
                                </Box>

                                <Button colorScheme='blue' mt={3} onClick={() => setCount(count + 1)}>
                                    Add
                                </Button>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={resetUser_id}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={CreateResponsibleSubmit}>Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                <Drawer
                    isOpen={isOpenModal4}
                    placement='right'
                    onClose={onCloseModal4}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth='1px'>
                            View Responsible
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Input
                                    type='hidden'
                                    name='responsible_id'
                                    value={formUpdateResponsible.toString()}
                                />

                                <Box>
                                    <FormLabel htmlFor='title'>Title</FormLabel>
                                    <FormLabel htmlFor='title'>{formUpdateResponsible.title}</FormLabel>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='title'>Responsible</FormLabel>
                                    {boxesUpdate}
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal4}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={CreateResponsibleSubmit}>Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Layout>
        </>
    )
}

export default SuperAdminTask