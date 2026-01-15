import React, { useState, useEffect } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { Card, Input, Select, Button } from '../ui'

/**
 * ProductFilter Component
 * Provides search, category, price range, location, and seller type filtering
 * 
 * Props:
 *   - onFilter: Callback function with filtered products
 *   - products: All available products to filter from
 *   - locations: Array of available locations
 */
export default function ProductFilter({
  onFilter = () => {},
  products = [],
  locations = ['Katsina', 'Kano', 'Katsina-Metropolis', 'Other'],
}) {
  const t = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedSellerType, setSelectedSellerType] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [priceRange, setPriceRange] = useState('all')
  const [autoCategories, setAutoCategories] = useState([])

  // Extract unique categories from products
  useEffect(() => {
    const cats = new Set()
    products.forEach((p) => {
      if (p.category) cats.add(p.category)
    })
    const newCategories = [t('productFilter.allCategories'), ...Array.from(cats).sort()]
    // Only update if categories changed
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAutoCategories((prev) => {
      const prevStr = JSON.stringify(prev)
      const newStr = JSON.stringify(newCategories)
      return prevStr !== newStr ? newCategories : prev
    })
  }, [products, t])

  // Available price ranges
  const priceRanges = [
    { value: 'all', label: t('productFilter.allPrices') },
    { value: '0-5000', label: '₦0 - ₦5,000' },
    { value: '5000-20000', label: '₦5,000 - ₦20,000' },
    { value: '20000-100000', label: '₦20,000 - ₦100,000' },
    { value: '100000+', label: '₦100,000+' },
  ]

  // Seller types
  const sellerTypes = [
    { value: 'all', label: t('productFilter.allSellers') },
    { value: 'verified', label: t('productFilter.verified') },
    { value: 'individual', label: t('productFilter.individual') },
    { value: 'business', label: t('productFilter.business') },
  ]

  // Apply filters
  useEffect(() => {
    let filtered = products

    // Search filter (title + description)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search)
      )
    }

    // Category filter
    if (selectedCategory !== 'all' && selectedCategory !== t('productFilter.allCategories')) {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Location filter
    if (selectedLocation !== 'all') {
      filtered = filtered.filter((p) => p.location === selectedLocation)
    }

    // Seller type filter
    if (selectedSellerType !== 'all') {
      if (selectedSellerType === 'verified') {
        filtered = filtered.filter((p) => p.verified === true)
      } else if (selectedSellerType === 'individual' || selectedSellerType === 'business') {
        filtered = filtered.filter((p) => p.sellerType === selectedSellerType)
      }
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter((p) => {
        const price = Number(p.price) || 0
        if (priceRange === '0-5000') return price >= 0 && price <= 5000
        if (priceRange === '5000-20000') return price > 5000 && price <= 20000
        if (priceRange === '20000-100000') return price > 20000 && price <= 100000
        if (priceRange === '100000+') return price > 100000
        return true
      })
    }

    // Custom min/max prices
    if (minPrice) {
      const min = Number(minPrice) || 0
      filtered = filtered.filter((p) => (Number(p.price) || 0) >= min)
    }

    if (maxPrice) {
      const max = Number(maxPrice) || 0
      filtered = filtered.filter((p) => (Number(p.price) || 0) <= max)
    }

    onFilter(filtered)
  }, [searchTerm, selectedCategory, selectedLocation, selectedSellerType, priceRange, minPrice, maxPrice, products, onFilter, t])

  // Reset all filters
  function handleReset() {
    setSearchTerm('')
    setSelectedCategory('all')
    setSelectedLocation('all')
    setSelectedSellerType('all')
    setPriceRange('all')
    setMinPrice('')
    setMaxPrice('')
  }

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || selectedLocation !== 'all' ||
                           selectedSellerType !== 'all' || priceRange !== 'all' || minPrice || maxPrice

  return (
    <Card variant="elevated" className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-kob-dark flex items-center gap-2">
            <span>🔍</span> {t('productFilter.title')}
          </h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
            >
              ✕ {t('productFilter.clearFilters')}
            </Button>
          )}
        </div>

        {/* Search Input */}
        <Input
          label={t('productFilter.search')}
          type="text"
          placeholder={t('productFilter.searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon="🔎"
        />

        {/* Category Filter */}
        {autoCategories.length > 1 && (
          <Select
            label={t('productFilter.category')}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">{t('productFilter.allCategories')}</option>
            {autoCategories.slice(1).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        )}

        {/* Location Filter */}
        <Select
          label={t('productFilter.location')}
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="all">{t('productFilter.allLocations')}</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </Select>

        {/* Seller Type Filter */}
        <Select
          label={t('productFilter.sellerType')}
          value={selectedSellerType}
          onChange={(e) => setSelectedSellerType(e.target.value)}
        >
          {sellerTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>

        {/* Price Range Quick Select */}
        <Select
          label={t('productFilter.priceRange')}
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </Select>

        {/* Custom Min/Max Price */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={t('productFilter.minPrice')}
            type="number"
            placeholder="e.g., 1000"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            label={t('productFilter.maxPrice')}
            type="number"
            placeholder="e.g., 50000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* Results Tip */}
        {products.length > 0 && (
          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
            {t('productFilter.tip')}
          </div>
        )}
      </div>
    </Card>
  )
}
