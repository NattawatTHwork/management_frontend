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
    InputRightElement
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { checkLoginAdmin } from '../../components/auth/checkLoginAdmin';
import Layout from '../../components/common/Layout';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';

interface Task {
    task_id: number;
    title: string;
    description: string;
    schedule: string;
    status: number;
    user_id: number;
    responsible_id: number;
    deleted: number;
}

const AdminMyTask = () => {
    const [mytasks, setMyTasks] = useState<Task[]>([]);
    const [myindex, setMyIndex] = useState<number>(0);
    const { isOpen: isOpenModal1, onOpen: onOpenModal1, onClose: onCloseModal1 } = useDisclosure();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(mytasks.length / itemsPerPage);
    const [searchTerm, setSearchTerm] = useState<string>('');


    useEffect(() => {
        fetchMyTasks();
    }, []);


    const fetchMyTasks = async () => {
        try {
            const decoded = await checkLoginAdmin();
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/task/my_task/${decoded.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status === 'success') {
                setMyTasks(result.message);
            } else {
                console.log('fetch data task failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const AcceptResponsible = async (responsible_id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/task/accept_responsible/${responsible_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status === 'success') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Task Accepted Successfully',
                    text: 'The task has been accepted to the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchMyTasks();
            } else if (result.status === 'error') {
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Accept Task',
                    text: 'There was an issue adding the accept to the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchMyTasks();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const ViewTask = async (index: number) => {
        onOpenModal1();
        setMyIndex(index);
    }

    return (
        <>
            <Layout>
                <Flex justify="flex-end" align="center" mt={4}>
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
                            {mytasks
                                .filter((task) => {
                                    const searchTermLower = searchTerm.toLowerCase();
                                    return task.title.toLowerCase().includes(searchTermLower)
                                        || task.description.toLowerCase().includes(searchTermLower)
                                        || task.schedule.toLowerCase().includes(searchTermLower)
                                        || (task.status === 1 ? 'Enable' : 'Disable').toLowerCase().includes(searchTermLower);
                                })
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((task, index) => (
                                    <Tr key={task.task_id}>
                                        <Td>{task.title}</Td>
                                        <Td>{new Date(task.schedule).toLocaleString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false })}</Td>
                                        <Td>
                                            <Box as='button' borderRadius='md' bg={task.status === 1 ? 'green.500' : 'red.500'} color='white' px={4} h={8}>
                                                {task.status === 1 ? 'Enable' : 'Disable'}
                                            </Box>
                                        </Td>
                                        <Td>
                                            <Menu>
                                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={() => ViewTask(index)}>View Responsible</MenuItem>
                                                    <MenuItem onClick={() => AcceptResponsible(task.responsible_id)}>Accept Responsible</MenuItem>
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
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel>{mytasks[myindex]?.title}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='description'>Description</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel>{mytasks[myindex]?.description}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='schedule'>Schedule</FormLabel>
                                    <Box style={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormLabel>{new Date(mytasks[myindex]?.schedule).toLocaleString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false })}</FormLabel>
                                    </Box>
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='status'>Status</FormLabel>
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <Box as="button" borderRadius="md" bg={mytasks[myindex]?.status === 1 ? 'green.500' : 'red.500'} color="white" px={4} h={10}>
                                            <FormLabel>{mytasks[myindex]?.status === 1 ? 'Enable' : 'Disable'}</FormLabel>
                                        </Box>
                                    </Box>
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal1}>
                                Close
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

            </Layout>
        </>
    )
}

export default AdminMyTask