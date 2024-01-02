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
    Flex,
    InputGroup,
    InputRightElement
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { checkLoginSuperAdmin } from '../../components/auth/checkLoginSuperAdmin';
import Layout from '../../components/common/Layout';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';

interface Position {
    position_id: number;
    position: string;
}

const SuperAdminPosition = () => {
    const [positions, setPositions] = useState<Position[]>([]);
    const { isOpen: isOpenModal1, onOpen: onOpenModal1, onClose: onCloseModal1 } = useDisclosure();
    const { isOpen: isOpenModal2, onOpen: onOpenModal2, onClose: onCloseModal2 } = useDisclosure();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(positions.length / itemsPerPage);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [formCreateData, setFormCreateData] = useState({
        position: '',
    });
    const [formUpdateData, setFormUpdateData] = useState({
        position_id: '',
        position: '',
    });

    useEffect(() => {
        checkLoginSuperAdmin();
        fetchPositions();
    }, []);

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

    const fetchThisPosition = async (position_id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/position/${position_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setFormUpdateData(result.message[0]);
                onOpenModal2();
            } else {
                console.log('fetch data position failed')
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

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const CreatePositionSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/position/create_position`, {
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
                    position: '',
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'Position Added Successfully',
                    text: 'The position has been added to the system.',
                });
                fetchPositions();
            } else if (result.status == 'error') {
                onCloseModal1();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add Position',
                    text: 'There was an issue adding the position to the system.',
                });
                fetchPositions();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const UpdatePositionSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/position/update_position/${formUpdateData.position_id}`, {
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
                    position_id: '',
                    position: '',
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'Position Updated Successfully',
                    text: 'The position has been updated in the system.',
                });
                fetchPositions();
            } else if (result.status == 'error') {
                onCloseModal2();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Update Position',
                    text: 'There was an issue updating the position in the system.',
                });
                fetchPositions();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const DeletePosition = async (position_id: number) => {
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
                const response = await fetch(`${process.env.REACT_APP_API_URL}/position/delete_position/${position_id}`, {
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
                        title: 'Position Deleted Successfully',
                        text: 'The position has been deleted from the system.',
                    });
                    fetchPositions();
                } else {
                    onCloseModal2();
                    await Swal.fire({
                        icon: 'error',
                        title: 'Failed to Delete Position',
                        text: 'There was an issue deleting the position from the system.',
                    });
                    fetchPositions();
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <>
            <Layout>
                <Flex justify="space-between" align="center" mt={4}>
                    <Box>
                        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpenModal1}>
                            Create Position
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
                                <Th>Position</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {positions
                                .filter((position) => {
                                    const searchTermLower = searchTerm.toLowerCase();
                                    return position.position.toLowerCase().includes(searchTermLower);
                                })
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((position) => (
                                    <Tr key={position.position_id}>
                                        <Td>{position.position}</Td>
                                        <Td>
                                            <Menu>
                                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={() => fetchThisPosition(position.position_id)}>Update</MenuItem>
                                                    <MenuItem onClick={() => DeletePosition(position.position_id)}>Delete</MenuItem>
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
                            Create a new position
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Box>
                                    <FormLabel htmlFor='position'>Position</FormLabel>
                                    <Input
                                        type='text'
                                        name='position'
                                        value={formCreateData.position}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter position'
                                    />
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal1}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={CreatePositionSubmit}>Submit</Button>
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
                            Update position
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Input
                                    type='hidden'
                                    name='rank_id'
                                    value={formUpdateData.position_id}
                                />

                                <Box>
                                    <FormLabel htmlFor='position'>Position</FormLabel>
                                    <Input
                                        type='text'
                                        name='position'
                                        value={formUpdateData.position}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter position'
                                    />
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal2}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={UpdatePositionSubmit}>Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Layout>
        </>
    )
}

export default SuperAdminPosition