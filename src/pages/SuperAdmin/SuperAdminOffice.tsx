import React, { useEffect, useState, FormEvent } from 'react'
import {
    Table,
    TableCaption,
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
    MenuItem
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { checkLoginSuperAdmin } from '../../components/auth/checkLoginSuperAdmin';
import Layout from '../../components/common/Layout';
import Swal from 'sweetalert2';

interface Office {
    office_id: number;
    company: string;
    start: string;
    end: string;
}

const SuperAdminOffice = () => {
    const [offices, setOffices] = useState<Office[]>([]);
    const { isOpen: isOpenModal1, onOpen: onOpenModal1, onClose: onCloseModal1 } = useDisclosure();
    const [formUpdateData, setFormUpdateData] = useState({
        office_id: 0,
        company: '',
        start: '',
        end: '',
    });

    useEffect(() => {
        checkLoginSuperAdmin();
        fetchOffices();
    }, []);

    const fetchOffices = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(process.env.REACT_APP_API_URL + '/office', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            const result = await response.json();

            if (result.status == 'success') {
                setOffices(result.message);
            } else {
                console.log('fetch data rank failed')
            }
        } catch (error) {
            console.log(error);
        }
    };

    const setForm = (office: Office) => {
        setFormUpdateData({
            office_id: office.office_id,
            company: office.company,
            start: office.start,
            end: office.end,
        });
        onOpenModal1();
    }
    

    const handleInputUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormUpdateData({
            ...formUpdateData,
            [e.target.name]: e.target.value,
        });
    };

    const UpdateOfficeSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/office/update_office/${formUpdateData.office_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify(formUpdateData),
            });

            const result = await response.json();

            if (result.status === 'success') {
                onCloseModal1();
                setFormUpdateData({
                    office_id: 0,
                    company: '',
                    start: '',
                    end: '',
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'Office Updated Successfully',
                    text: 'The office has been updated in the system.',
                });
                fetchOffices();
            } else if (result.status == 'error') {
                onCloseModal1();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Update Office',
                    text: 'There was an issue updating the office in the system.',
                });
                fetchOffices();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <>
            <Layout>
                <TableContainer>
                    <Table variant='striped' colorScheme='teal'>
                        <TableCaption>Imperial to metric conversion factors</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Company</Th>
                                <Th>Start</Th>
                                <Th>End</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {offices.map((office) => (
                                <Tr key={office.office_id}>
                                    <Td>{office.company}</Td>
                                    <Td>{office.start.toLocaleString()}</Td>
                                    <Td>{office.end.toLocaleString()}</Td>
                                    <Td>
                                        <Menu>
                                            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                                Actions
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem onClick={() => setForm(office)}>Update</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
                <Drawer
                    isOpen={isOpenModal1}
                    placement='right'
                    onClose={onCloseModal1}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader borderBottomWidth='1px'>
                            Update office
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Input
                                    type='hidden'
                                    name='office_id'
                                    value={formUpdateData.office_id}
                                />

                                <Box>
                                    <FormLabel htmlFor='company'>Company</FormLabel>
                                    <Input
                                        type='text'
                                        name='company'
                                        value={formUpdateData.company}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter company'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='start'>Start</FormLabel>
                                    <Input
                                        type='time'
                                        name='start'
                                        value={formUpdateData.start}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter start'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='end'>End</FormLabel>
                                    <Input
                                        type='time'
                                        name='end'
                                        value={formUpdateData.end}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter end'
                                    />
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal1}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={UpdateOfficeSubmit}>Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Layout>
        </>
    )
}

export default SuperAdminOffice