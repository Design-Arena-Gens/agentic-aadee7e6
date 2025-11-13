'use client'

import { useState, FormEvent } from 'react'
import styles from './page.module.css'

interface Contact {
  name: string
  phone: string
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [newContactName, setNewContactName] = useState('')
  const [newContactPhone, setNewContactPhone] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [message, setMessage] = useState('')
  const [showAddContact, setShowAddContact] = useState(false)
  const [suggestions, setSuggestions] = useState<Contact[]>([])
  const [error, setError] = useState('')

  const addContact = (e: FormEvent) => {
    e.preventDefault()
    if (!newContactName.trim() || !newContactPhone.trim()) {
      setError('Please fill in both name and phone number')
      return
    }

    const phone = newContactPhone.replace(/\D/g, '')
    if (phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }

    const newContact = {
      name: newContactName.trim(),
      phone: phone
    }

    setContacts([...contacts, newContact])
    setNewContactName('')
    setNewContactPhone('')
    setShowAddContact(false)
    setError('')
  }

  const handleNameInput = (value: string) => {
    setRecipientName(value)
    if (value.trim()) {
      const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const selectContact = (contact: Contact) => {
    setRecipientName(contact.name)
    setSuggestions([])
  }

  const sendMessage = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (!recipientName.trim()) {
      setError('Please enter a recipient name')
      return
    }

    if (!message.trim()) {
      setError('Please enter a message')
      return
    }

    const contact = contacts.find(c =>
      c.name.toLowerCase() === recipientName.toLowerCase()
    )

    if (!contact) {
      setError(`Contact "${recipientName}" not found. Please add them first.`)
      return
    }

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${contact.phone}?text=${encodedMessage}`

    window.open(whatsappUrl, '_blank')

    setMessage('')
    setRecipientName('')
  }

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1>WhatsApp Messenger</h1>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={sendMessage} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="recipient">Recipient Name</label>
            <input
              id="recipient"
              type="text"
              placeholder="Enter contact name..."
              value={recipientName}
              onChange={(e) => handleNameInput(e.target.value)}
              className={styles.input}
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <div className={styles.suggestions}>
                {suggestions.map((contact, i) => (
                  <div
                    key={i}
                    className={styles.suggestion}
                    onClick={() => selectContact(contact)}
                  >
                    <span className={styles.suggestionName}>{contact.name}</span>
                    <span className={styles.suggestionPhone}>{contact.phone}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles.textarea}
              rows={4}
            />
          </div>

          <button type="submit" className={styles.sendButton}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={styles.buttonIcon}>
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Send on WhatsApp
          </button>
        </form>

        <div className={styles.divider}>
          <span>Contacts</span>
        </div>

        {contacts.length > 0 && (
          <div className={styles.contactsList}>
            {contacts.map((contact, i) => (
              <div key={i} className={styles.contactItem}>
                <div>
                  <div className={styles.contactName}>{contact.name}</div>
                  <div className={styles.contactPhone}>{contact.phone}</div>
                </div>
                <button
                  onClick={() => removeContact(i)}
                  className={styles.removeButton}
                  type="button"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {!showAddContact ? (
          <button
            onClick={() => setShowAddContact(true)}
            className={styles.addContactButton}
            type="button"
          >
            + Add New Contact
          </button>
        ) : (
          <form onSubmit={addContact} className={styles.addContactForm}>
            <h3>Add New Contact</h3>
            <input
              type="text"
              placeholder="Contact name"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              className={styles.input}
            />
            <input
              type="tel"
              placeholder="Phone number (with country code)"
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
              className={styles.input}
            />
            <div className={styles.addContactButtons}>
              <button type="submit" className={styles.saveButton}>
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddContact(false)
                  setNewContactName('')
                  setNewContactPhone('')
                  setError('')
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
