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
    InputRightElement,
    Select
} from '@chakra-ui/react';
import { AddIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { checkLoginSuperAdmin } from '../../components/auth/checkLoginSuperAdmin';
import Layout from '../../components/common/Layout';
import Swal from 'sweetalert2';
import Pagination from '../../components/Pagination';

interface Equipment {
    equipment_id: number;
    equipment: string;
    status: number;
}

const SuperAdminEquipment = () => {
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const { isOpen: isOpenModal1, onOpen: onOpenModal1, onClose: onCloseModal1 } = useDisclosure();
    const { isOpen: isOpenModal2, onOpen: onOpenModal2, onClose: onCloseModal2 } = useDisclosure();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(equipments.length / itemsPerPage);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [formCreateData, setFormCreateData] = useState({
        equipment: ''
    });
    const [formUpdateData, setFormUpdateData] = useState({
        equipment_id: '',
        equipment: '',
        status: ''
    });

    useEffect(() => {
        checkLoginSuperAdmin();
        fetchEquipments();
    }, []);

    const fetchEquipments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_API_URL + '/equipment', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setEquipments(result.message);
            } else {
                console.log('fetch data rank failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fetchThisEquipment = async (equipment_id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/equipment/${equipment_id}`, {
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
                console.log('fetch data equipment failed')
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

    const handleSelectUpdateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormUpdateData({
            ...formUpdateData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const CreateEquipmentSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formCreateData.equipment) {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/equipment/create_equipment`, {
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
                    equipment: ''
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'Equipment Added Successfully',
                    text: 'The equipment has been added to the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchEquipments();
            } else if (result.status == 'error') {
                onCloseModal1();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add Equipment',
                    text: 'There was an issue adding the equipment to the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchEquipments();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const UpdateEquipmentSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formUpdateData.equipment_id || !formUpdateData.equipment || !formUpdateData.status) {
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/equipment/update_equipment/${formUpdateData.equipment_id}`, {
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
                    equipment_id: '',
                    equipment: '',
                    status: ''
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'Equipment Updated Successfully',
                    text: 'The equipment has been updated in the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchEquipments();
            } else if (result.status == 'error') {
                onCloseModal2();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Update Equipment',
                    text: 'There was an issue updating the equipment in the system.',
                    confirmButtonColor: '#3182CE',
                });
                fetchEquipments();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const DeleteEquipment = async (equipment_id: number) => {
        const result = await Swal.fire({
            title: 'Confirm Deletion',
            text: 'Do you want to delete this equipment?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3182CE',
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.REACT_APP_API_URL}/equipment/delete_equipment/${equipment_id}`, {
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
                        title: 'Equipment Deleted Successfully',
                        text: 'The equipment has been deleted from the system.',
                        confirmButtonColor: '#3182CE',
                    });
                    fetchEquipments();
                } else {
                    onCloseModal2();
                    await Swal.fire({
                        icon: 'error',
                        title: 'Failed to Delete Equipment',
                        text: 'There was an issue deleting the equipment from the system.',
                        confirmButtonColor: '#3182CE',
                    });
                    fetchEquipments();
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
                            Create Equipment
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
                                <Th>Equipment</Th>
                                <Th>Status</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {equipments
                                .filter((equipment) => {
                                    const searchTermLower = searchTerm.toLowerCase();
                                    return equipment.equipment.toLowerCase().includes(searchTermLower) || (equipment.status === 1 ? 'Enable' : 'Disable').toLowerCase().includes(searchTermLower);
                                })
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((equipment) => (
                                    <Tr key={equipment.equipment_id}>
                                        <Td>{equipment.equipment}</Td>
                                        <Td>
                                            <Box as='button' borderRadius='md' bg={equipment.status == 1 ? 'green.500' : 'red.500'} color='white' px={4} h={8}>
                                                {equipment.status == 1 ? 'Enable' : 'Disable'}
                                            </Box>
                                        </Td>
                                        <Td>
                                            <Menu>
                                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={() => fetchThisEquipment(equipment.equipment_id)}>Update</MenuItem>
                                                    <MenuItem onClick={() => DeleteEquipment(equipment.equipment_id)}>Delete</MenuItem>
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
                            Create a new equipment
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Box>
                                    <FormLabel htmlFor='rank'>Equipment</FormLabel>
                                    <Input
                                        type='text'
                                        name='equipment'
                                        value={formCreateData.equipment}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter full equipment'
                                    />
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal1}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={CreateEquipmentSubmit}>Submit</Button>
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
                            Update equipment
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Input
                                    type='hidden'
                                    name='equipment_id'
                                    value={formUpdateData.equipment_id}
                                />

                                <Box>
                                    <FormLabel htmlFor='equipment'>Equipment</FormLabel>
                                    <Input
                                        type='text'
                                        name='equipment'
                                        value={formUpdateData.equipment}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter full equipment'
                                    />
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
                            <Button colorScheme='blue' onClick={UpdateEquipmentSubmit}>Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Layout>
        </>
    )
}

export default SuperAdminEquipment