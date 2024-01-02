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

interface Rank {
    rank_id: number;
    rank: string;
    rank_s: string;
}

const SuperAdminRank = () => {
    const [ranks, setRanks] = useState<Rank[]>([]);
    const { isOpen: isOpenModal1, onOpen: onOpenModal1, onClose: onCloseModal1 } = useDisclosure();
    const { isOpen: isOpenModal2, onOpen: onOpenModal2, onClose: onCloseModal2 } = useDisclosure();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(ranks.length / itemsPerPage);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [formCreateData, setFormCreateData] = useState({
        rank: '',
        rank_s: '',
    });
    const [formUpdateData, setFormUpdateData] = useState({
        rank_id: '',
        rank: '',
        rank_s: '',
    });

    useEffect(() => {
        checkLoginSuperAdmin();
        fetchRanks();
    }, []);

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

    const fetchThisRank = async (rank_id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/rank/${rank_id}`, {
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
                console.log('fetch data rank failed')
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

    const CreateRankSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/rank/create_rank`, {
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
                    rank: '',
                    rank_s: '',
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'Rank Added Successfully',
                    text: 'The rank has been added to the system.',
                });
                fetchRanks();
            } else if (result.status == 'error') {
                onCloseModal1();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Add Rank',
                    text: 'There was an issue adding the rank to the system.',
                });
                fetchRanks();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const UpdateRankSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/rank/update_rank/${formUpdateData.rank_id}`, {
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
                    rank_id: '',
                    rank: '',
                    rank_s: '',
                });
                await Swal.fire({
                    icon: 'success',
                    title: 'Rank Updated Successfully',
                    text: 'The rank has been updated in the system.',
                });
                fetchRanks();
            } else if (result.status == 'error') {
                onCloseModal2();
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Update Rank',
                    text: 'There was an issue updating the rank in the system.',
                });
                fetchRanks();
            } else {
                alert('Failed')
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const DeleteRank = async (rank_id: number) => {
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
                const response = await fetch(`${process.env.REACT_APP_API_URL}/rank/delete_rank/${rank_id}`, {
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
                        title: 'Rank Deleted Successfully',
                        text: 'The rank has been deleted from the system.',
                    });
                    fetchRanks();
                } else {
                    onCloseModal2();
                    await Swal.fire({
                        icon: 'error',
                        title: 'Failed to Delete Rank',
                        text: 'There was an issue deleting the rank from the system.',
                    });
                    fetchRanks();
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
                            Create Rank
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
                                <Th>Full Rank</Th>
                                <Th>Short Rank</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {ranks
                                .filter((rank) => {
                                    const searchTermLower = searchTerm.toLowerCase();
                                    return rank.rank.toLowerCase().includes(searchTermLower) || rank.rank_s.toLowerCase().includes(searchTermLower);
                                })
                                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                .map((rank) => (
                                    <Tr key={rank.rank_id}>
                                        <Td>{rank.rank}</Td>
                                        <Td>{rank.rank_s}</Td>
                                        <Td>
                                            <Menu>
                                                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                                                    Actions
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={() => fetchThisRank(rank.rank_id)}>Update</MenuItem>
                                                    <MenuItem onClick={() => DeleteRank(rank.rank_id)}>Delete</MenuItem>
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
                            Create a new rank
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Box>
                                    <FormLabel htmlFor='rank'>Full Prefix</FormLabel>
                                    <Input
                                        type='text'
                                        name='rank'
                                        value={formCreateData.rank}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter full rank'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='rank_s'>Short Prefix</FormLabel>
                                    <Input
                                        type='text'
                                        name='rank_s'
                                        value={formCreateData.rank_s}
                                        onChange={handleInputCreateChange}
                                        placeholder='Please enter short rank'
                                    />
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal1}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={CreateRankSubmit}>Submit</Button>
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
                            Update rank
                        </DrawerHeader>

                        <DrawerBody>
                            <Stack spacing='24px'>
                                <Input
                                    type='hidden'
                                    name='rank_id'
                                    value={formUpdateData.rank_id}
                                />

                                <Box>
                                    <FormLabel htmlFor='rank'>Full Prefix</FormLabel>
                                    <Input
                                        type='text'
                                        name='rank'
                                        value={formUpdateData.rank}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter full rank'
                                    />
                                </Box>

                                <Box>
                                    <FormLabel htmlFor='rank_s'>Short Prefix</FormLabel>
                                    <Input
                                        type='text'
                                        name='rank_s'
                                        value={formUpdateData.rank_s}
                                        onChange={handleInputUpdateChange}
                                        placeholder='Please enter short rank'
                                    />
                                </Box>
                            </Stack>
                        </DrawerBody>

                        <DrawerFooter borderTopWidth='1px'>
                            <Button variant='outline' mr={3} onClick={onCloseModal2}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={UpdateRankSubmit}>Submit</Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Layout>
        </>
    )
}

export default SuperAdminRank