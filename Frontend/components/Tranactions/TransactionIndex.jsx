import React, { useEffect, useState } from 'react'
import TransactionCard from './TransactionCard'
import Navigator from "../Navigator/Navigator.jsx"
import QuickActions from "../QuickAction/QuickAction.jsx"
import axios from "axios"

const TransactionIndex = () => {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [rawData, setRawData] = useState(null)
    const [accountNames, setAccountNames] = useState({})
    const [namesLoaded, setNamesLoaded] = useState(false)

    const apiUrl = import.meta.env.VITE_BACKEND_URL

    const fetchName = async (accountID) => {
        if (!accountID) return 'N/A'

        if (accountNames[accountID]) {
            return accountNames[accountID]
        }

        try {
            const response = await axios.get(`${apiUrl}/api/data/fetchname/${accountID}`, {
                withCredentials: true
            })

            if (response.status === 200 && response.data.success) {
                const name = response.data.data?.bank_account?.name || 'Unknown'

                setAccountNames(prev => ({
                    ...prev,
                    [accountID]: name
                }))

                return name
            }
        } catch (error) {
            console.log("Error fetching names:", error)
        }
        return 'N/A'
    }

    const fetchAllAccountNames = async () => {
        if (transactions.length === 0 || namesLoaded) return

        try {

            const uniqueAccountIds = [...new Set(
                transactions
                    .map(t => t.source?.fund_account_id)
                    .filter(id => id)
            )]

            const namePromises = uniqueAccountIds.map(accountId => fetchName(accountId))
            await Promise.all(namePromises)

            setNamesLoaded(true)


        } catch (error) {
            console.log("Error fetching names->", error)
        }
    }

    const fetchTransactions = async () => {
        try {
            setLoading(true)
            setError(null)


            const response = await axios.get(`${apiUrl}/api/data/gettransactions`, {
                withCredentials: true
            })


            if (response.status === 200) {
                setRawData(response.data)

                if (response.data && response.data.success) {
                    if (response.data.data && Array.isArray(response.data.data.items)) {
                        // console.log('Found items array:', response.data.data.items)
                        setTransactions(response.data.data.items)
                    } else if (response.data.data && Array.isArray(response.data.data)) {
                        // console.log('Data is directly an array:', response.data.data)
                        setTransactions(response.data.data)
                    } else {
                        // console.log('Unexpected data structure:', response.data.data)
                        setTransactions([])
                    }
                } else {
                    console.log('Response not successful or missing data:', response.data)
                    setTransactions([])
                }
            }
        } catch (error) {
            console.error('Error fetching transactions:', error)
            setError(error.response?.data?.message || error.message || 'Failed to fetch transactions')
            setTransactions([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    useEffect(() => {
        if (transactions.length > 0 && !namesLoaded) {
            fetchAllAccountNames()
        }
    }, [transactions, namesLoaded])

    const formatAmount = (amount) => {
        if (amount !== null && amount !== undefined) {
            return `₹${(amount / 100).toFixed(2)}`
        }
        return '₹0.00'
    }

    const formatDate = (timestamp) => {
        if (timestamp) {
            const date = timestamp > 1000000000000 ? new Date(timestamp) : new Date(timestamp * 1000)
            return date.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
        return 'N/A'
    }

    const getStatusColor = (status) => {
        if (!status) return 'text-gray-600'

        switch (status.toLowerCase()) {
            case 'completed':
            case 'success':
                return 'text-green-600'
            case 'pending':
            case 'processing':
                return 'text-yellow-600'
            case 'failed':
            case 'error':
                return 'text-red-600'
            default:
                return 'text-gray-600'
        }
    }

    return (
        <>
            <div className='bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-500 '>
                <div>
                    <Navigator />
                </div>
                <div className='mx-[10%]'>
                    <QuickActions />
                </div>
                <div className='m-5 p-5 text-bold bg-slate-800 text-slate-100 rounded-2xl mx-[10%]'>
                    <p className='text-3xl font-bold px-5 mb-6'>Transactions History</p>

                    {loading && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-2 text-gray-600">Loading transactions...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-8">
                            <p className="text-red-600">{error}</p>
                            <button
                                onClick={fetchTransactions}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && transactions.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No transactions found</p>
                            <button
                                onClick={fetchTransactions}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Refresh
                            </button>
                        </div>
                    )}

                    {!loading && !error && transactions.length > 0 && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600 mb-2">
                                {!namesLoaded && <span className="ml-2 text-blue-600">Loading account names...</span>}
                            </p>
                            {transactions.map((transaction, index) => (
                                <TransactionCard
                                    key={transaction.id || transaction.transaction_id || index}
                                    accountID={accountNames[transaction.source?.fund_account_id] || 'Loading...'}
                                    fundAccountID={transaction.source?.fund_account_id || 'N/A'}
                                    amount={formatAmount(transaction.amount)}
                                    createdAt={formatDate(transaction.created_at || transaction.createdAt)}
                                    status={transaction.source?.status || 'Unknown'}
                                    statusColor={getStatusColor(transaction.source?.status)}
                                    transaction={transaction}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default TransactionIndex
